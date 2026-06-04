import express from "express";
import {
  createOrder,
  getMyOrders,
  updateOrderToPaid,
  getOrderById,
  updateOrderToDelivered,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/myorders", getMyOrders);
router.put("/:id/pay", updateOrderToPaid);
router.get("/:id", getOrderById);
router.put("/:id/deliver", updateOrderToDelivered);

export default router;
