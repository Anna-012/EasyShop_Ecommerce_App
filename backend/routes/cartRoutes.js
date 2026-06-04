import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cartController.js";

const router = express.Router();

router.post("/", addToCart);
router.get("/", getCart);
router.delete("/", removeFromCart);
router.put("/", updateCartItem);

export default router;
