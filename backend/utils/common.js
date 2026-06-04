import jwt from "jsonwebtoken";

// Generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// OTP expiry (10 minutes)
const generateOtpExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000);
};

export { generateOtp, generateOtpExpiry };
