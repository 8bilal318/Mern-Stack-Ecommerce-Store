import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ShoppingBag,
  MapPin,
  Minus,
  Plus,
  Trash2,
  CheckCircle2,
  Loader2,
  Package,
  Banknote,
  Lock,
  ChevronRight,
  AlertTriangle,
  Download,
} from "lucide-react";
import {
  fetchCartItems,
  deleteCartItem,
  updateCartQuantity,
  resetCart,
} from "@/store/shop/cart-slice";
import { createCheckoutSession, createCodOrder } from "@/store/shop/order-slice";
import { toast } from "sonner";
import { downloadReceipt } from "@/utils/downloadReceipt";

const SHIPPING_FEE = 10;

const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", desc: "Pay securely via Stripe", icon: CreditCard },
  { id: "cod", label: "Cash on Delivery", desc: "Pay when it arrives", icon: Banknote },
];

const initialAddress = {
  address: "",
  city: "",
  pincode: "",
  phone: "",
  notes: "",
};

// ─── Inline Cart Item ────────────────────────────────────────────────────────
function CheckoutCartItem({ cartItem }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { cartItems } = useSelector((s) => s.cart);
  const { productList } = useSelector((s) => s.shopProducts) || {};

  const userId = user?.id || user?._id;

  function handleQty(item, dir) {
    if (dir === "plus") {
      const idx = (cartItems?.items || []).findIndex((i) => i.productId === item.productId);
      const pidx = (productList || []).findIndex((p) => p._id === item.productId);
      const stock = pidx > -1 ? productList[pidx].totalStock : item.totalStock;
      if (idx > -1 && stock && cartItems.items[idx].quantity + 1 > stock) {
        toast.error("Max stock reached for this item");
        return;
      }
    }
    dispatch(
      updateCartQuantity({
        userId,
        productId: item.productId,
        quantity: dir === "plus" ? item.quantity + 1 : item.quantity - 1,
      })
    );
  }

  function handleDelete(item) {
    dispatch(deleteCartItem({ userId, productId: item.productId })).then((d) => {
      if (d?.payload?.success) toast.success("Item removed");
    });
  }

  const price = (cartItem.salePrice > 0 ? cartItem.salePrice : cartItem.price) * cartItem.quantity;

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-200 bg-white hover:border-orange-200 hover:shadow-sm transition-all">
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        <img src={cartItem.image} alt={cartItem.title} className="h-full w-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{cartItem.title}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-gray-200 rounded-md bg-gray-50 overflow-hidden">
            <button
              disabled={cartItem.quantity === 1}
              onClick={() => handleQty(cartItem, "minus")}
              className="h-7 w-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-semibold text-gray-800">{cartItem.quantity}</span>
            <button
              onClick={() => handleQty(cartItem, "plus")}
              className="h-7 w-7 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="text-sm font-semibold text-gray-900">${price.toFixed(2)}</span>
        <button
          onClick={() => handleDelete(cartItem)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Step Indicator ──────────────────────────────────────────────────────────
function StepIndicator({ addressSaved, paymentMethod, itemsExist }) {
  const steps = [
    { label: "Cart", done: itemsExist },
    { label: "Address", done: addressSaved },
    { label: "Payment", done: !!paymentMethod },
  ];

  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-colors ${
                step.done
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-400 border border-gray-300"
              }`}
            >
              {step.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:inline ${step.done ? "text-gray-800" : "text-gray-400"}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-gray-300" />}
        </div>
      ))}
    </div>
  );
}

// ─── Main Checkout Page ──────────────────────────────────────────────────────
const Checkout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { cartItems, isLoading } = useSelector((s) => s.cart);
  const { payments: paymentsEnabled, shipping: shippingEnabled } = useSelector((s) => s.shopSettings);
  const [addressForm, setAddressForm] = useState(initialAddress);
  const [addressSaved, setAddressSaved] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderInfo, setPlacedOrderInfo] = useState(null);

  const userId = user?.id || user?._id;
  const items = cartItems?.items || [];

  useEffect(() => {
    if (userId) dispatch(fetchCartItems(userId));
  }, [userId, dispatch]);

  const subtotal = items.reduce((acc, item) => {
    return acc + (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity;
  }, 0);
  const total = subtotal + (items.length && shippingEnabled ? SHIPPING_FEE : 0);

  const addressFilled = ["address", "city", "pincode", "phone"].every((k) => addressForm[k].trim());

  function handleAddressSave(e) {
    e.preventDefault();
    if (!addressFilled) {
      toast.error("Please fill all required fields");
      return;
    }
    setAddressSaved(true);
    toast.success("Shipping address saved");
  }

  async function handlePlaceOrder() {
    if (!addressSaved) {
      toast.error("Please save your shipping address first");
      return;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (paymentMethod === "card" && !paymentsEnabled) {
      toast.error("Online payments are temporarily unavailable. Please try again later.");
      return;
    }
    if (!items.length) {
      toast.error("Your cart is empty");
      return;
    }

    setPlacing(true);

    const orderData = {
      userId,
      cartItems: items.map((i) => ({
        productId: i.productId,
        title: i.title,
        image: i.image,
        price: i.salePrice > 0 ? i.salePrice : i.price,
        quantity: i.quantity,
      })),
      addressInfo: addressForm,
      totalAmount: total,
    };

    try {
      if (paymentMethod === "card") {
        // Create a Stripe Checkout Session and redirect to its hosted page
        const res = await dispatch(createCheckoutSession(orderData)).unwrap();
        if (res?.url) {
          window.location.href = res.url;
          return; // redirecting, nothing more to do
        }
        toast.error("Could not start payment. Please try again.");
      } else {
        // COD: create the order directly
        const res = await dispatch(createCodOrder({ ...orderData, paymentMethod })).unwrap();
        if (res?.success) {
          setPlacedOrderInfo(res.data);
          setOrderPlaced(true);
          dispatch(resetCart()); // As soon as the order is placed, empty the cart in local state
        }
      }
    } catch (err) {
      toast.error(err?.message || "Order placement failed. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  // ── Order Placed Screen ──────────────────────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center p-6">
        <div className="text-center max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Order Confirmed</h1>
          <p className="text-gray-500 text-sm mb-8">
            Thank you, <span className="text-gray-900 font-medium">{user?.username || user?.email?.split("@")[0] || "Customer"}</span>. Your order
            will be shipped to <span className="text-gray-700">{placedOrderInfo?.addressInfo?.city || addressForm.city}</span>.
          </p>

          <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 text-left mb-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order ID</span>
                <span className="font-medium text-gray-800">#{placedOrderInfo?._id?.slice(-8) || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Items</span>
                <span className="font-medium text-gray-800">{placedOrderInfo?.cartItems?.length ?? 0}</span>
              </div>
              <div className="h-px bg-gray-200" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-bold text-orange-600">${Number(placedOrderInfo?.totalAmount ?? 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Method</span>
                <span className="font-medium text-gray-800">
                  {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}
                </span>
              </div>
            </div>
          </Card>

          {placedOrderInfo?._id && (
            <Button
              variant="outline"
              onClick={() => downloadReceipt(placedOrderInfo._id)}
              className="w-full h-12 mb-3 rounded-xl border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              <Download className="h-4 w-4 mr-2" /> Download Receipt
            </Button>
          )}

          <Button
            onClick={() => (window.location.href = "/shop/home")}
            className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        {/* Header */}
        <div className="mb-8">
          <p className="text-orange-600 text-xs font-semibold uppercase tracking-wider mb-2">Secure Checkout</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Complete your order</h1>
        </div>

        <StepIndicator addressSaved={addressSaved} paymentMethod={paymentMethod} itemsExist={items.length > 0} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Cart Items */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <Package className="text-orange-600 h-4.5 w-4.5" />
                <h2 className="text-base font-semibold text-gray-900">Order Items</h2>
                <span className="ml-auto text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-2.5 py-0.5">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                </div>
              ) : items.length === 0 ? (
                <div className="h-28 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                  <ShoppingBag className="h-6 w-6 mb-2 opacity-40" />
                  <span className="text-xs font-medium">Your cart is empty</span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {items.map((item) => (
                    <CheckoutCartItem key={item.productId} cartItem={item} />
                  ))}
                </div>
              )}
            </Card>

            {/* Shipping Address */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <Truck className="text-orange-600 h-4.5 w-4.5" />
                <h2 className="text-base font-semibold text-gray-900">Shipping Address</h2>
                {addressSaved && (
                  <span className="ml-auto flex items-center gap-1 text-xs font-medium text-emerald-600 border border-emerald-200 rounded-full px-2.5 py-0.5 bg-emerald-50">
                    <CheckCircle2 className="h-3 w-3" /> Saved
                  </span>
                )}
              </div>

              <form onSubmit={handleAddressSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "address", label: "Street Address", placeholder: "123 Main Street", full: true },
                    { name: "city", label: "City", placeholder: "Lahore" },
                    { name: "pincode", label: "Pincode / ZIP", placeholder: "54000" },
                    { name: "phone", label: "Phone Number", placeholder: "+92 300 0000000" },
                  ].map(({ name, label, placeholder, full }) => (
                    <div key={name} className={full ? "sm:col-span-2" : ""}>
                      <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                        {label} <span className="text-orange-600">*</span>
                      </Label>
                      <Input
                        value={addressForm[name]}
                        onChange={(e) => {
                          setAddressSaved(false);
                          setAddressForm((p) => ({ ...p, [name]: e.target.value }));
                        }}
                        placeholder={placeholder}
                        className="bg-white border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 h-10"
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
                      Delivery Notes <span className="text-gray-400 font-normal">(optional)</span>
                    </Label>
                    <Textarea
                      value={addressForm.notes}
                      onChange={(e) => {
                        setAddressSaved(false);
                        setAddressForm((p) => ({ ...p, notes: e.target.value }));
                      }}
                      placeholder="Leave at door, call before delivery…"
                      className="bg-white border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus-visible:border-orange-500 focus-visible:ring-orange-500/20 resize-none"
                      rows={2}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={!addressFilled}
                  variant="outline"
                  className="w-full h-10 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-lg border-gray-300 disabled:opacity-40"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {addressSaved ? "Update Address" : "Save Address"}
                </Button>
              </form>
            </Card>

            {/* Payment Method */}
            <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
              <div className="flex items-center gap-2.5 mb-4">
                <CreditCard className="text-orange-600 h-4.5 w-4.5" />
                <h2 className="text-base font-semibold text-gray-900">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-1">
                {PAYMENT_METHODS.map(({ id, label, desc, icon: Icon }) => {
                  const isCardDisabled = id === "card" && !paymentsEnabled;
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={isCardDisabled}
                      onClick={() => !isCardDisabled && setPaymentMethod(id)}
                      className={`flex flex-col items-start gap-2 p-4 rounded-xl border text-left transition-colors ${
                        isCardDisabled
                          ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                          : paymentMethod === id
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 ${paymentMethod === id && !isCardDisabled ? "text-orange-600" : "text-gray-500"}`} />
                      <div>
                        <p className={`text-sm font-medium ${paymentMethod === id && !isCardDisabled ? "text-gray-900" : "text-gray-700"}`}>
                          {label}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {isCardDisabled ? "Temporarily unavailable" : desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {paymentMethod === "card" && (
                <div className="mt-4 p-4 bg-orange-50/60 rounded-xl border border-orange-100 flex items-start gap-3">
                  <Lock className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    You'll be redirected to Stripe's secure checkout page to enter your card details. We never see
                    or store your card number.
                  </p>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="mt-4 p-4 bg-orange-50/60 rounded-xl border border-orange-100 flex items-start gap-3">
                  <Banknote className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Pay in cash when your order arrives at your doorstep. No upfront payment required.
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* ── RIGHT COLUMN: Order Summary ── */}
          <div className="lg:col-span-1">
            <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 sticky top-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-5">Order Summary</h2>

              {items.length > 0 && (
                <div className="space-y-2.5 mb-5 max-h-48 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-2.5 text-xs">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-9 w-9 rounded-md object-cover border border-gray-200 flex-shrink-0"
                      />
                      <span className="flex-1 text-gray-500 truncate">{item.title}</span>
                      <span className="text-gray-700 font-medium">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="h-px bg-gray-200 mb-5" />

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-800 font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-800 font-medium">
                    {!items.length
                      ? "—"
                      : shippingEnabled
                      ? `$${SHIPPING_FEE.toFixed(2)}`
                      : "Free (manual)"}
                  </span>
                </div>
                <div className="h-px bg-gray-200" />
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-2xl font-bold text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {[
                  { label: "Cart not empty", done: items.length > 0 },
                  { label: "Address saved", done: addressSaved },
                  { label: "Payment method set", done: !!paymentMethod },
                ].map(({ label, done }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    <div
                      className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                        done ? "bg-orange-600" : "bg-gray-100 border border-gray-300"
                      }`}
                    >
                      {done && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                    </div>
                    <span className={done ? "text-gray-700" : "text-gray-400"}>{label}</span>
                  </div>
                ))}
              </div>

              {!paymentsEnabled && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-orange-300 bg-orange-50 px-3 py-2.5 text-xs font-semibold text-orange-700">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  Payments are temporarily unavailable. Please try again later.
                </div>
              )}

              <Button
                onClick={handlePlaceOrder}
                disabled={placing || !items.length || !paymentsEnabled}
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {placing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing…
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg bg-gray-50">
                <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[10px] font-medium text-gray-500">256-bit encrypted &amp; secure</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;