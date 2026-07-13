import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

import {
  createOrder,
  getMyOrders,
  updateOrderToPaid,
  getOrderById,
  updateOrderToDelivered,
  getAllOrders,
  updateOrderStatus,
  getSellerOrders,
  updateSellerOrderStatus,
} from "../controllers/orderController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import { seller } from "../middleware/sellerMiddleware.js";

const router = express.Router();

router.get("/seller-orders", authMiddleware, seller, getSellerOrders);
router.post("/", authMiddleware, createOrder);
router.get("/myorders", authMiddleware, getMyOrders);
router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.put("/:id/pay", authMiddleware, updateOrderToPaid);
router.patch(
  "/seller-orders/:id/status",
  authMiddleware,
  seller,
  updateSellerOrderStatus,
);

router.put(
  "/:id/deliver",
  authMiddleware,
  adminMiddleware,
  updateOrderToDelivered,
);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);
// Seller

router.get("/:id", authMiddleware, getOrderById);

export default router;
