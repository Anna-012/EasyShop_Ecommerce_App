import express from "express";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  deleteUserByAdmin,
  getAllSellers,
  getDashboardStats,
  getSellerDashboardByAdmin,
  updateSellerStatus,
  getAllUsers,
  getUserById,
  toggleUserStatus,
} from "../controllers/adminController.js";
import { getProductsBySeller } from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, adminMiddleware, getDashboardStats);
router.get("/get-all-sellers", authMiddleware, adminMiddleware, getAllSellers);
router.put(
  "/seller-status/:id",
  authMiddleware,
  adminMiddleware,
  updateSellerStatus,
);
router.delete(
  "/delete-user/:id",
  authMiddleware,
  adminMiddleware,
  deleteUserByAdmin,
);

router.get(
  "/seller/:sellerId",
  authMiddleware,
  adminMiddleware,
  getProductsBySeller,
);

router.get(
  "/seller/:sellerId/dashboard",
  authMiddleware,
  adminMiddleware,
  getSellerDashboardByAdmin,
);

router.get("/user/:id", authMiddleware, adminMiddleware, getUserById);

router.get("/get-all-users", authMiddleware, adminMiddleware, getAllUsers);
router.put(
  "/toggle-user-status/:id",
  authMiddleware,
  adminMiddleware,
  toggleUserStatus,
);

export default router;
