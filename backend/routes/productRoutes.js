import express from "express";
import {
  getAllProductByCategory,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-all-products", getAllProducts);
router.get(
  "/get-all-products-by-category/:categoryId",
  getAllProductByCategory,
);
router.get("/get-product/:id", authMiddleware, getProductById);
router.post("/createProduct", authMiddleware, adminMiddleware, createProduct);
router.put(
  "/update-product/:id",
  authMiddleware,
  adminMiddleware,
  updateProduct,
);
router.delete(
  "/deleteProduct/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct,
);

export default router;
