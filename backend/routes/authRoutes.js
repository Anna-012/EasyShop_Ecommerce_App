import express from "express";
import {
  registerUser,
  resendOtp,
  verifyOtp,
  loginUser,
  logoutUser,
  registerSeller,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
// {seller}
router.post("/seller/register", registerSeller);
export default router;
