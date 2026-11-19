// Load .env FIRST, before any other import reads process.env
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cookiesParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth/auth-routes.js";
import adminProductRouter from "./routes/auth/admin/Products-routes.js";
import adminOrderRouter from "./routes/auth/admin/order-routes.js";
import adminDashboardRouter from "./routes/auth/admin/dashboard-routes.js";
import adminSettingsRouter from "./routes/auth/admin/settings-routes.js";
import adminNotificationRouter from "./routes/auth/admin/notification-routes.js";
import shopProductRouter from "./routes/auth/shop/Products-routes.js";
import shopCartRouter from "./routes/auth/shop/cart-routes.js";
import shopOrderRouter from "./routes/auth/shop/order-routes.js";
import shopSettingsRouter from "./routes/auth/shop/settings-routes.js";
import shopChatbotRouter from "./routes/auth/shop/chatbot-routes.js";
import { handleStripeWebhook } from "./controllers/shop/order-controller.js";
import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const DEFAULT_CLIENT_ORIGINS = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
];

const CLIENT_ORIGINS = (
  process.env.CLIENT_ORIGIN
    ? process.env.CLIENT_ORIGIN.split(",")
    : DEFAULT_CLIENT_ORIGINS
)
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from environment variables.");
}

//create db connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((err) => {
    console.log("DB connection failed", err);
  });

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // Allow any localhost / 127.0.0.1 port (Vite may pick 5174, 5175, ... when 5173 is busy)
      const isLocalDev =
        !!origin && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

      if (!origin || isLocalDev || CLIENT_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "cache-control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  }),
);

// Stripe webhook: needs the raw body, so it must be registered separately BEFORE express.json()
app.post(
  "/api/shop/order/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

app.use(express.json());
app.use(cookiesParser());

app.use("/api/auth", authRouter);

app.use("/api/admin/products", adminProductRouter);

app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/admin/dashboard", adminDashboardRouter);

app.use("/api/admin/settings", adminSettingsRouter);

app.use("/api/admin/notifications", adminNotificationRouter);

app.use("/api/shop/products", shopProductRouter);

app.use("/api/shop/cart", shopCartRouter);

app.use("/api/shop/order", shopOrderRouter);

app.use("/api/shop/settings", shopSettingsRouter);

app.use("/api/shop/chatbot", shopChatbotRouter);

// In a Vercel serverless environment the app handles requests itself,
// so the traditional app.listen() only runs on a normal server (Render/Back4app/local).
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;