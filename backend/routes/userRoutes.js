import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { seller } from "../middleware/sellerMiddleware.js";

import { getProductsBySeller } from "../controllers/productController.js";
const router = express.Router();

router.get("/get-user-by-id", authMiddleware, getUserById);
router.get("/get-user-by-email", authMiddleware, getUserByEmail);

router.put("/update-user", authMiddleware, updateUser);
router.delete("/delete-user", authMiddleware, deleteUser);

export default router;
