import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/Products.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phoneNumber ||
      !shippingAddress.houseNo ||
      !shippingAddress.area ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        message: "Please fill complete address",
      });
    }

    // Check stock for every product
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          message: `${product.title} is no longer available`,
        });
      }

      if (product.stockQuantity < item.qty) {
        return res.status(400).json({
          message: `Only ${product.stockQuantity} ${product.title} left in stock`,
        });
      }
    }

    const totalPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0,
    );

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,

      isPaid: paymentMethod === "Razorpay",
      paidAt: paymentMethod === "Razorpay" ? new Date() : null,
    });

    const createdOrder = await order.save();

    // Reduce stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stockQuantity: -item.qty,
        },
      });
    }

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      {
        items: [],
      },
    );

    return res.status(201).json({
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error("ORDER ERROR 👉", error);
    res.status(500).json({ message: error.message });
  }
};

// GET MY ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORDER TO PAID
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORDER TO DELIVERED
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE ORDER
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("orderItems.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name price image countInStock");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      if (order.paymentMethod === "COD") {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
    }

    const updateOrder = await order.save();
    res.json(updateOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    console.log("Seller:", req.user._id);
    // Seller ke products
    const products = await Product.find({
      seller: req.user._id,
    });

    console.log("Products:", products);

    const productIds = products.map((product) => product._id);

    // Un products wale orders
    const orders = await Order.find({
      "orderItems.product": { $in: productIds },
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateSellerOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();

      if (order.paymentMethod === "COD") {
        order.isPaid = true;
        order.paidAt = new Date();
      }
    } else {
      order.isDelivered = false;
      order.deliveredAt = null;

      if (order.paymentMethod === "COD") {
        order.isPaid = false;
        order.paidAt = null;
      }
    }

    await order.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
