import express from "express";

const router = express.Router();

import {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
} from "../../../controllers/admin/productController.js";

import { upload } from "../../../helpers/cloudinary.js";
import { authMiddleware } from "../../../controllers/auth-controller.js";
import isAdmin from "../../../middleware/isAdmin.js";

router.use(authMiddleware, isAdmin);

router.post("/upload-image", upload.single("my_file"), handleImageUpload);
router.post("/add", addProduct);
router.get("/get", fetchAllProducts);
router.put("/edit/:id", editProduct);
router.delete("/delete/:id", deleteProduct);

export default router;