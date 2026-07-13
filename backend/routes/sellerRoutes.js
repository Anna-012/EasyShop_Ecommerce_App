import express from "express";
import { seller } from "../middleware/sellerMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getSellerDashboard,
  getSellerProfile,
  updateSellerProfile,
} from "../controllers/sellerController.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/seller-profile", authMiddleware, seller, getSellerProfile);
router.put("/seller-profile", authMiddleware, seller, updateSellerProfile);

router.get("/dashboard", authMiddleware, seller, getSellerDashboard);

export default router;
