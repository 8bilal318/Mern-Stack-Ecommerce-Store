import express from "express";
const router = express.Router();

import {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "../../../controllers/admin/orderController.js";
import { authMiddleware } from "../../../controllers/auth-controller.js";
import isAdmin from "../../../middleware/isAdmin.js";

router.use(authMiddleware, isAdmin);

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:id", getOrderDetailsForAdmin);
router.put("/update/:id", updateOrderStatus);

export default router;
