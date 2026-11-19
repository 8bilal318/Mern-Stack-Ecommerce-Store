import mongoose from "mongoose";

// Sirf ek hi settings document hoga poori app ke liye (singleton pattern)
const SettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "site_settings",
      unique: true,
    },
    features: {
      storefront: { type: Boolean, default: true },
      inventory: { type: Boolean, default: true },
      payments: { type: Boolean, default: true },
      shipping: { type: Boolean, default: true },
      notifications: { type: Boolean, default: true },
      security: { type: Boolean, default: true },
    },
    popup: {
      enabled: { type: Boolean, default: false },
      title: { type: String, default: "Welcome to BillaMart!" },
      message: {
        type: String,
        default: "Check out our latest deals and offers.",
      },
      image: { type: String, default: "" },
      buttonText: { type: String, default: "Shop Now" },
      buttonLink: { type: String, default: "/shop/listing" },
      delaySeconds: { type: Number, default: 1 },
      showOncePerSession: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", SettingsSchema);
