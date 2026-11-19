import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    addressInfo: {
      address: String,
      city: String,
      pincode: String,
      phone: String,
      notes: String,
    },
    orderStatus: { type: String, default: "pending" }, // pending, confirmed, shipped, delivered
    paymentMethod: { type: String, default: "card" }, // card | cod
    paymentStatus: { type: String, default: "pending" }, // pending, paid, failed
    totalAmount: { type: Number, required: true },
    stripeSessionId: String,
    stripePaymentIntentId: String,
    orderDate: { type: Date, default: Date.now },
    receiptEmailedAt: Date, // receipt email kab bheji gayi (duplicate se bachne ke liye)
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
