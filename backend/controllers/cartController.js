import Cart from "../models/cartModel.js";
import Product from "../models/Products.js";

export const addToCart = async (req, res) => {
  const { productId, qty } = req.body;

  // ✅ Get product
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // ✅ stock check
    if (qty > product.countInStock) {
      return res.status(400).json({
        message: `Only ${product.countInStock} items left in stock`,
      });
    }

    cart = new Cart({
      user: req.user._id,
      items: [{ product: productId, qty }],
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].qty + qty;

      // ✅ stock check
      if (newQty > product.countInStock) {
        return res.status(400).json({
          message: `Only ${product.countInStock} items available`,
        });
      }

      cart.items[itemIndex].qty = newQty;
    } else {
      // ✅ stock check
      if (qty > product.countInStock) {
        return res.status(400).json({
          message: `Only ${product.countInStock} items available`,
        });
      }

      cart.items.push({ product: productId, qty });
    }
  }

  await cart.save();
  res.json(cart);
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const product = await Product.findById(productId);

    if (qty > product.stockQuantity) {
      return res.status(400).json({
        message: `Only ${product.stockQuantity} items left in stock`,
      });
    }

    item.qty = qty;

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
