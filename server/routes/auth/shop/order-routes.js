import express from "express";
const router = express.Router();

import {
  createCheckoutSession,
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  downloadReceipt,
  verifyStripePayment,
} from "../../../controllers/shop/order-controller.js";
import { authMiddleware } from "../../../controllers/auth-controller.js";

router.post("/create-checkout-session", createCheckoutSession);
router.post("/create", createOrder);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/receipt/:orderId", authMiddleware, downloadReceipt);
router.get("/verify/:orderId", verifyStripePayment);
router.get("/:orderId", getOrderDetails);

export default router;