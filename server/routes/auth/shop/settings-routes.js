import express from "express";
const router = express.Router();

import { getPublicSettings } from "../../../controllers/shop/settingsController.js";

router.get("/get", getPublicSettings);

export default router;
