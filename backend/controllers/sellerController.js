import User from "../models/User.js";
import Product from "../models/Products.js";
import Order from "../models/orderModel.js";

export const getSellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(req.user._id).select(
      "-password -otp -otpExpiryAt -resetPasswordToken -resetPasswordExpire",
    );

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    return res.status(200).json({
      seller,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateSellerProfile = async (req, res) => {
  try {
    const { name, phoneNumber, address } = req.body;

    const seller = await User.findById(req.user._id);

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    seller.name = name || seller.name;
    seller.phoneNumber = phoneNumber || seller.phoneNumber;
    seller.address = address || seller.address;

    await seller.save();

    return res.status(200).json({
      message: "Profile updated successfully",

      seller: {
        _id: seller._id,
        name: seller.name,
        email: seller.email,
        phoneNumber: seller.phoneNumber,
        address: seller.address,
        role: seller.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getSellerDashboard = async (req, res) => {
  try {
    // Seller ke products
    const products = await Product.find({
      seller: req.user._id,
      isActive: true,
    }).sort({ createdAt: -1 });

    const productIds = products.map((product) => product._id);

    // Seller ke orders
    const orders = await Order.find({
      "orderItems.product": {
        $in: productIds,
      },
    }).sort({ createdAt: -1 });

    // Revenue
    const revenue = orders.reduce(
      (total, order) => total + order.totalPrice,
      0,
    );

    // Latest 5 products
    const latestProducts = products.slice(0, 5);

    // Latest 5 orders
    const recentOrders = orders.slice(0, 5);

    return res.status(200).json({
      totalProducts: products.length,
      totalOrders: orders.length,
      revenue,
      latestProducts,
      recentOrders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
