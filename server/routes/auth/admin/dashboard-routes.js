import express from "express";
const router = express.Router();

import { getDashboardStats } from "../../../controllers/admin/dashboardController.js";
import { authMiddleware } from "../../../controllers/auth-controller.js";
import isAdmin from "../../../middleware/isAdmin.js";

router.use(authMiddleware, isAdmin);

router.get("/stats", getDashboardStats);

export default router;
