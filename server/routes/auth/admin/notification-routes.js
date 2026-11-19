import express from "express";
const router = express.Router();

import {
  getNotifications,
  markAllNotificationsRead,
} from "../../../controllers/admin/notificationController.js";
import { authMiddleware } from "../../../controllers/auth-controller.js";
import isAdmin from "../../../middleware/isAdmin.js";

router.use(authMiddleware, isAdmin);

router.get("/get", getNotifications);
router.put("/mark-read", markAllNotificationsRead);

export default router;
