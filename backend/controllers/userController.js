import User from "../models/User.js";

export const getUserById = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select(
      "-password -otp -otpExpiry",
    );
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//Example of query params - GET/get-user-by-email?email=afreenshabbagh@gmail.com
export const getUserByEmail = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Forbidden",
      });
    }

    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email }).select(
      "-password -otp -otpExpiry",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -otp -otpExpiry");

    return res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phoneNumber, address } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(userId);
    return res.status(200).json({
      message: "user deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
