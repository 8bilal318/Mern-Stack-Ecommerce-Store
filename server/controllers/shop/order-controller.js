import Stripe from "stripe";
import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import Product from "../../models/Product.js";
import Settings from "../../models/Settings.js";
import Notification from "../../models/Notification.js";
import User from "../../models/User.js";
import { generateReceiptBuffer } from "../../helpers/receipt.js";
import { sendReceiptEmail, isMailConfigured } from "../../helpers/mailer.js";

// Create the Stripe client lazily (on first use) instead of at import time.
// At import time `.env` may not be loaded yet, which crashed the whole server with
// "Neither apiKey nor config.authenticator provided".
let stripeClient = null;
const getStripe = () => {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is missing from server/.env");
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeClient;
};
const SHIPPING_FEE_CENTS = 1000; // $10.00

// When Inventory Sync is ON, reduce the stock of the order's items in the DB
async function syncInventoryForOrder(cartItems) {
  const settings = await Settings.findOne({ key: "site_settings" });
  const inventorySyncEnabled = settings?.features?.inventory ?? true;

  if (!inventorySyncEnabled) return;

  await Promise.all(
    cartItems.map((item) =>
      Product.findByIdAndUpdate(item.productId, {
        $inc: { totalStock: -Math.abs(item.quantity) },
      })
    )
  );
}

// Check whether the Automated Shipping feature is ON
async function isShippingEnabled() {
  const settings = await Settings.findOne({ key: "site_settings" });
  return settings?.features?.shipping ?? true;
}

// Check whether the Payment Gateways feature is ON (server-side hard check)
async function isPaymentsEnabled() {
  const settings = await Settings.findOne({ key: "site_settings" });
  return settings?.features?.payments ?? true;
}

// When Push Notifications are ON, create a "new order received" notification for the admin
async function notifyNewOrder(order) {
  const settings = await Settings.findOne({ key: "site_settings" });
  const notificationsEnabled = settings?.features?.notifications ?? true;

  if (!notificationsEnabled) return;

  await Notification.create({
    title: "New Order Received",
    message: `Order worth $${order.totalAmount?.toFixed(2)} has been placed.`,
    type: "order",
    orderId: order._id,
  });
}

// When an order is confirmed, email the receipt (with PDF) to the customer.
// If the email fails, the order/payment is not affected (it is only logged).
async function sendReceiptForOrder(order) {
  try {
    if (!isMailConfigured()) {
      console.log("Receipt email skipped: SMTP settings missing in .env");
      return;
    }
    if (order.receiptEmailedAt) return; // already sent earlier

    const user = await User.findById(order.userId);
    if (!user?.email) return;

    const pdfBuffer = await generateReceiptBuffer(order, {
      username: user.username,
      email: user.email,
    });
    await sendReceiptEmail({
      to: user.email,
      customerName: user.username,
      order,
      pdfBuffer,
    });

    await Order.findByIdAndUpdate(order._id, { receiptEmailedAt: new Date() });
    console.log(`Receipt email sent to ${user.email} for order ${order._id}`);
  } catch (err) {
    console.log("Receipt email failed:", err.message);
  }
}

// Fulfill a paid order (status paid, stock, notification, empty cart, receipt email).
// This is IDEMPOTENT: both the webhook and the verify endpoint can call it,
// but the work only happens once (the atomic update prevents double stock deduction / double email).
async function fulfillPaidOrder(orderId, paymentIntentId) {
  const claimed = await Order.findOneAndUpdate(
    { _id: orderId, paymentStatus: { $ne: "paid" } },
    {
      paymentStatus: "paid",
      orderStatus: "confirmed",
      ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
    },
    { returnDocument: "after" }
  );

  if (claimed) {
    try {
      await syncInventoryForOrder(claimed.cartItems);
      await notifyNewOrder(claimed);
    } catch (err) {
      console.log("Post-payment tasks failed:", err.message);
    }
    // As soon as payment is confirmed, empty the user's server-side cart
    await Cart.findOneAndUpdate({ userId: claimed.userId }, { items: [] });
  }

  // Order (already paid earlier or just now) - send the receipt email if it has not gone out yet
  const order = claimed || (await Order.findById(orderId));
  if (order && order.paymentStatus === "paid" && !order.receiptEmailedAt) {
    await sendReceiptForOrder(order);
  }
  return order;
}

// Stripe only accepts public http(s) image URLs. A relative path, a data: URL or a
// localhost URL makes the whole checkout fail with "Not a valid URL", so we only
// send images that Stripe can actually fetch (the product is still charged without one).
const getStripeImages = (image) => {
  if (!image || typeof image !== "string") return [];
  try {
    const url = new URL(image.trim());
    const host = url.hostname;
    const isPublicHttp =
      (url.protocol === "https:" || url.protocol === "http:") &&
      host !== "localhost" &&
      !/^127\./.test(host) &&
      !/^(10\.|192\.168\.)/.test(host);
    return isPublicHttp && url.href.length <= 2048 ? [url.href] : [];
  } catch {
    return [];
  }
};

// 1) Card payment: create a Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  let newOrder = null;
  try {
    const { userId, cartItems, addressInfo, totalAmount } = req.body;

    if (!userId || !cartItems?.length || !addressInfo || !totalAmount) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // If the admin has turned Payment Gateways OFF, stop here (server-side hard check)
    if (!(await isPaymentsEnabled())) {
      return res.status(403).json({
        success: false,
        message: "Online payments are temporarily unavailable. Please try again later.",
      });
    }

    // First save the order in the DB with a "pending" status
    newOrder = new Order({
      userId,
      cartItems,
      addressInfo,
      totalAmount,
      paymentMethod: "card",
      paymentStatus: "pending",
      orderStatus: "pending",
    });
    await newOrder.save();

    // Convert cart items to Stripe's line_items format
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: getStripeImages(item.image),
        },
        unit_amount: Math.round(item.price * 100), // Stripe takes the amount in cents
      },
      quantity: item.quantity,
    }));

    // Shipping fee as a separate line item (only when Automated Shipping is ON)
    if (await isShippingEnabled()) {
      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Shipping Fee" },
          unit_amount: SHIPPING_FEE_CENTS,
        },
        quantity: 1,
      });
    }

    // Redirect back to the site the customer is actually on (e.g. localhost:5174),
    // falling back to CLIENT_ORIGIN_SINGLE. Only trusted origins are accepted.
    const requestOrigin = req.headers.origin;
    const trustedOrigins = (process.env.CLIENT_ORIGIN || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
    const isTrustedOrigin =
      !!requestOrigin &&
      (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(requestOrigin) ||
        trustedOrigins.includes(requestOrigin) ||
        requestOrigin === process.env.CLIENT_ORIGIN_SINGLE);
    const clientBaseUrl = isTrustedOrigin
      ? requestOrigin
      : process.env.CLIENT_ORIGIN_SINGLE;

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${clientBaseUrl}/shop/payment-success?orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientBaseUrl}/shop/payment-cancel?orderId=${newOrder._id}`,
      metadata: { orderId: newOrder._id.toString(), userId },
    });

    newOrder.stripeSessionId = session.id;
    await newOrder.save();

    return res
      .status(200)
      .json({ success: true, url: session.url, orderId: newOrder._id });
  } catch (error) {
    console.log("Checkout session error:", error?.message || error);

    // Do not leave an unpaid "pending" order behind when the Stripe session failed
    if (newOrder?._id) {
      await Order.findByIdAndDelete(newOrder._id).catch(() => {});
    }

    return res.status(500).json({
      success: false,
      message: "Error creating checkout session",
      // Helpful while developing; hidden in production
      detail: process.env.NODE_ENV === "production" ? undefined : error?.message,
    });
  }
};

// 2) Stripe Webhook: update the Order when payment is confirmed
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId && session.payment_status === "paid") {
      try {
        await fulfillPaidOrder(orderId, session.payment_intent);
      } catch (err) {
        console.log("Webhook fulfillment failed:", err.message);
        return res.status(500).json({ received: false }); // Stripe will retry
      }
    }
  }

  res.status(200).json({ received: true });
};

// 3) Cash on Delivery order (other than card)
export const createOrder = async (req, res) => {
  try {
    const { userId, cartItems, addressInfo, totalAmount, paymentMethod } =
      req.body;

    if (!userId || !cartItems?.length || !addressInfo || !totalAmount) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new Order({
      userId,
      cartItems,
      addressInfo,
      totalAmount,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: "pending",
      orderStatus: "confirmed",
    });
    await newOrder.save();

    // If Inventory Sync is ON, reduce the stock
    await syncInventoryForOrder(cartItems);

    // If Push Notifications are ON, notify the admin
    await notifyNewOrder(newOrder);

    // As soon as a COD order is confirmed, empty the user's cart
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    // Email the receipt to the customer (PDF attached)
    await sendReceiptForOrder(newOrder);

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};

// 4) Fetch all orders of the logged-in user (My Orders / Account page)
export const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User id is required" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user orders" });
  }
};

// 5) Verify / display the order on the success page
export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching order" });
  }
};

// 6) Receipt PDF download (only the order owner or an admin)
export const downloadReceipt = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const isOwner = order.userId.toString() === String(req.user.id);
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (order.paymentMethod === "card" && order.paymentStatus !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Receipt will be available once payment is confirmed.",
      });
    }

    const user = await User.findById(order.userId);
    const pdfBuffer = await generateReceiptBuffer(order, {
      username: user?.username,
      email: user?.email,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="receipt-${order._id.toString().slice(-8)}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error generating receipt" });
  }
};


// 7) Called from the success page: asks Stripe directly for the payment status and fulfills the order.
// Even if the webhook does not run (e.g. `stripe listen` is not running locally), the order is still marked paid, the cart is emptied and the email is sent.
export const verifyStripePayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.paymentMethod === "card" && order.paymentStatus !== "paid") {
      if (!order.stripeSessionId) {
        return res.status(400).json({ success: false, message: "No Stripe session for this order" });
      }
      const session = await getStripe().checkout.sessions.retrieve(order.stripeSessionId);
      if (session.payment_status === "paid") {
        const updated = await fulfillPaidOrder(order._id, session.payment_intent);
        return res.status(200).json({ success: true, data: updated });
      }
      return res.status(200).json({ success: true, data: order });
    }

    // Already paid: if the email was missed, try again
    if (order.paymentStatus === "paid" && !order.receiptEmailedAt) {
      await sendReceiptForOrder(order);
    }
    const fresh = await Order.findById(order._id);
    return res.status(200).json({ success: true, data: fresh });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error verifying payment" });
  }
};