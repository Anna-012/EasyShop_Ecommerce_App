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
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/get-all-categories", getAllCategories);
router.get("/get-category/:id", getCategoryById);

router.delete(
  "/delete-category/:id",
  authMiddleware,
  adminMiddleware,
  deleteCategory,
);

// admin
router.post(
  "/create-category",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createCategory,
);

router.put(
  "/update-category/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateCategory,
);

export default router;
