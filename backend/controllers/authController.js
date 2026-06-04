import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateOtp, generateOtpExpiry } from "../utils/common.js";
import userRegistrationSchema from "../utils/validators.js";
import sendEmailForOtp from "../utils/nodemailer.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { error } = userRegistrationSchema.validate({
      name,
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otp = generateOtp();
    const otpExpiry = generateOtpExpiry();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    await newUser.save();

    await sendEmailForOtp(email, otp);

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(409).json({
        message: "User not found",
      });
    }

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(409).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "User already verified",
      });
    }
    const otp = generateOtp();
    const otpExpiry = generateOtpExpiry();

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save();
    await sendEmailForOtp(email, otp);

    return res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(200).json({
        message: "Login successful but email not verified",
        token: null,
        isVerified: false,
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      isVerified: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};
