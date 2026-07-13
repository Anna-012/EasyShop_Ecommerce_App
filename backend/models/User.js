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
    phoneNumber: {
      type: String,
      minlength: 10,
      maxlength: 10,
      trim: true,
    },

    address: {
      fullName: {
        type: String,
        trim: true,
      },
      houseNo: {
        type: String,
        trim: true,
      },
      area: {
        type: String,
        trim: true,
      },
      landmark: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      pincode: {
        type: String,
        trim: true,
      },
    },
    otp: { type: String },
    otpExpiryAt: { type: Date },
    sellerStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    profileImage: {
      type: String,
      default: "",
    },
    lastLogin: {
      type: Date,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
