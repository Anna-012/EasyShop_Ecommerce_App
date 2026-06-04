import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/get-all-categories", authMiddleware, getAllCategories);
router.get("/get-category/:id", authMiddleware, getCategoryById);
router.post("create-category", authMiddleware, adminMiddleware, createCategory);
router.put(
  "/update-category/:id",
  authMiddleware,
  adminMiddleware,
  updateCategory,
);
router.delete(
  "/delete-category/:id",
  authMiddleware,
  adminMiddleware,
  deleteCategory,
);

export default router;
