import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 6 },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin", "seller"], default: "user" },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    phoneNumber: { type: String, minlength: 10, maxlength: 10, trim: true },
    address: { type: String, trim: true },
    otp: { type: String },
    otpExpiryAt: { type: Date },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
