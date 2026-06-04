import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
const router = express.Router();

router.get("/get-user-by-id", authMiddleware, getUserById);
router.get("/get-user-by-email", authMiddleware, getUserByEmail);
router.get("/get-all-users", authMiddleware, adminMiddleware, getAllUsers);
router.put("/update-user", authMiddleware, updateUser);
router.delete("/delete-user", authMiddleware, deleteUser);

export default router;
