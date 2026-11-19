import express from "express";

const router = express.Router();

import {
  getFilterProducts,
  getProductDetails,
  searchProducts,
} from "../../../controllers/shop/productsController.js";

router.get("/get", getFilterProducts);
router.get("/get/:id", getProductDetails);
router.get("/search/:keyword", searchProducts);

export default router;