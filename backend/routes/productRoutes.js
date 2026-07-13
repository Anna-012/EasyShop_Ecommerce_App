import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProductByCategory,
  getAllProducts,
  getProductById,
  getSellerProducts,
  toggleProductStatus,
  updateProduct,
} from "../controllers/productController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { seller } from "../middleware/sellerMiddleware.js";

const router = express.Router();

router.get("/get-all-products", getAllProducts);
router.get(
  "/get-all-products-by-category/:categoryId",
  getAllProductByCategory,
);
router.get("/get-product/:id", getProductById);

router.get("/seller-products", authMiddleware, seller, getSellerProducts);

// seller and admin Product routes
router.post(
  "/createProduct",
  authMiddleware,
  seller,
  upload.array("images", 5),
  createProduct,
);

router.put(
  "/update-product/:id",
  authMiddleware,
  seller,
  upload.array("images", 5),
  updateProduct,
);

router.delete(
  "/deleteProduct/:id",
  authMiddleware,

  seller,
  deleteProduct,
);

router.put("/toggle-status/:id", authMiddleware, seller, toggleProductStatus);

export default router;
