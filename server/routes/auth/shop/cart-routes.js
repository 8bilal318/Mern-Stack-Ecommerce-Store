// import express from "express";
// const router = express.Router();

// import {
//   addToCart,
//   fetchCartItems,
//   updateCartItemQty,
//   deleteCartItem,
// } from "../../../controllers/shop/cart-controller.js";

// router.post("/add", addToCart);
// router.get("/get/:userId", fetchCartItems);
// router.put("/update-cart", updateCartItemQty);
// router.delete("/delete", deleteCartItem);

// export default router;













import express from "express";
const router = express.Router();

import {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
  clearCart,
} from "../../../controllers/shop/cart-controller.js";

router.post("/add", addToCart);
router.get("/get/:userId", fetchCartItems);
router.put("/update-cart", updateCartItemQty);
router.delete("/delete", deleteCartItem);
router.delete("/clear/:userId", clearCart);

export default router;