import Cart from "../models/cartModel.js";
import Product from "../models/Products.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;

    // Validate product ID and quantity
    if (!productId || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        message: "Invalid product or quantity.",
      });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const stock = Number(product.stockQuantity);

    if (!Number.isFinite(stock) || stock < 0) {
      return res.status(400).json({
        message: "Invalid product stock.",
      });
    }

    if (stock === 0) {
      return res.status(400).json({
        message: "This product is out of stock.",
      });
    }

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    const item = cart.items.find(
      (entry) => entry.product.toString() === productId.toString(),
    );

    const existingQty = item ? Number(item.qty) : 0;
    const newQty = existingQty + qty;

    // Allow adding when requested quantity is within stock
    if (newQty > stock) {
      return res.status(400).json({
        message: `Only ${stock} ${
          stock === 1 ? "item" : "items"
        } left in stock.`,
      });
    }

    if (item) {
      item.qty = newQty;
    } else {
      cart.items.push({
        product: productId,
        qty,
      });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    return res.status(200).json({
      message: "Product added to cart successfully.",
      items: updatedCart.items,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      message: "Unable to add product to cart.",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );

    if (!cart) {
      return res.json({ items: [] });
    }

    // Remove cart items whose product no longer exists
    const validItems = cart.items.filter((item) => item.product !== null);

    // If invalid items were found, update the cart in database
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
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

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (entry) => entry.product.toString() === productId,
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (qty > product.stockQuantity) {
      return res.status(400).json({
        message: `Only ${product.stockQuantity} items left in stock`,
      });
    }

    item.qty = qty;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    return res.json(updatedCart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
