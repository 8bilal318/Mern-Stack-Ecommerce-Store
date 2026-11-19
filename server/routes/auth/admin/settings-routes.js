import express from "express";
const router = express.Router();

import {
  getSettings,
  updateFeatures,
  updatePopup,
} from "../../../controllers/admin/settingsController.js";
import { authMiddleware } from "../../../controllers/auth-controller.js";
import isAdmin from "../../../middleware/isAdmin.js";

router.use(authMiddleware, isAdmin);

router.get("/get", getSettings);
router.put("/features", updateFeatures);
router.put("/popup", updatePopup);

export default router;
