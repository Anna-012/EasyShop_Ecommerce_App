import User from "../models/User.js";
import Order from "../models/orderModel.js";
import Product from "../models/Products.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
    }).select("-password -otp -otpExpiry");

    const usersWithOrderCount = await Promise.all(
      users.map(async (user) => {
        const ordersCount = await Order.countDocuments({
          user: user._id,
        });

        return {
          ...user._doc,
          ordersCount,
        };
      }),
    );

    const totalUsers = users.length;

    const activeUsers = users.filter((u) => !u.isBlocked).length;

    const blockedUsers = users.filter((u) => u.isBlocked).length;

    return res.status(200).json({
      message: "Users fetched successfully",

      totalUsers,

      activeUsers,

      blockedUsers,

      users: usersWithOrderCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const totalCustomers = await User.countDocuments({
      role: "user",
    });

    const totalSellers = await User.countDocuments({
      role: "seller",
    });

    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    const recentOrders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalSellers,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" }).select(
      "-password -otp -otpExpiryAt -resetPasswordToken -resetPasswordExpire",
    );

    return res.status(200).json({
      sellers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  const { id } = req.params;

  await User.findByIdAndDelete(id);

  res.status(200).json({
    message: "User deleted successfully",
  });
};

export const updateSellerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { sellerStatus } = req.body;

    const seller = await User.findById(id);

    if (!seller || seller.role !== "seller") {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    seller.sellerStatus = sellerStatus;

    await seller.save();

    return res.status(200).json({
      message: "Seller status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getSellerDashboardByAdmin = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Seller Details
    const seller = await User.findById(sellerId).select(
      "-password -otp -otpExpiryAt -resetPasswordToken -resetPasswordExpire",
    );

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    // Seller Products
    const products = await Product.find({
      seller: sellerId,
      isActive: true,
    }).sort({ createdAt: -1 });

    const productIds = products.map((product) => product._id);

    // Seller Orders
    const orders = await Order.find({
      "orderItems.product": {
        $in: productIds,
      },
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Revenue
    const revenue = orders.reduce(
      (total, order) => total + order.totalPrice,
      0,
    );

    const latestProducts = products.slice(0, 5);

    const recentOrders = orders.slice(0, 5);

    return res.status(200).json({
      seller,

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

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select(
      "-password -otp -otpExpiryAt -resetPasswordToken -resetPasswordExpire",
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Get all orders of this user
    const orders = await Order.find({
      user: id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      user,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isBlocked = !user.isBlocked;

    await user.save();

    res.json({
      message: "User status updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
