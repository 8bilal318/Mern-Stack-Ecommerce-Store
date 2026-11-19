import express from "express";
import { handleChatMessage } from "../../../controllers/shop/chatbotController.js";

const router = express.Router();

// Public route: guests and logged-in customers can both chat.
// (Auth cookie, if present, is read inside the controller for order lookups.)
router.post("/message", handleChatMessage);

export default router;
