import Product from "../models/Products.js";
import User from "../models/User.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
    })
      .populate("category", "title")
      .populate("seller", "name email");
    return res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProductByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({
      category: categoryId,
      isActive: true,
    }).populate("category", "title");
    res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category", "title");
    if (!product || !product.isActive) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    return res.status(200).json({
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      mrpPrice,
      sellingPrice,
      category,
      stockQuantity,
      brand,
    } = req.body;

    const imageUrls = req.files.map((file) => file.path);

    const newProduct = new Product({
      title,
      description,
      mrpPrice,
      sellingPrice,
      category,
      stockQuantity,
      brand,
      images: imageUrls,
      seller: req.user._id,
    });

    await newProduct.save();

    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      mrpPrice,
      sellingPrice,
      category,
      stockQuantity,
      brand,
    } = req.body;

    const product = await Product.findById(id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Seller can update only his own product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can update only your own products",
      });
    }

    // Update fields
    if (title) product.title = title;

    if (description) product.description = description;

    if (mrpPrice !== undefined) product.mrpPrice = mrpPrice;

    if (sellingPrice !== undefined) product.sellingPrice = sellingPrice;

    if (category) product.category = category;

    if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;

    if (brand) product.brand = brand;

    // Update images only if new images are uploaded
    if (req.files && req.files.length > 0) {
      product.images = req.files.map((file) => file.path);
    }

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product || !product.isActive) {
      return res.status(200).json({
        message: "Product not found",
      });
    }

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can delete only your own products",
      });
    }

    product.isActive = false;
    await product.save();

    const updatedProduct = await Product.findById(id);

    console.log(updatedProduct);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
    }).populate("category", "title");

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // Seller details
    const seller = await User.findById(sellerId).select(
      "name email phoneNumber sellerStatus address createdAt",
    );

    if (!seller) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    // Seller products
    const products = await Product.find({
      seller: sellerId,
      isActive: true,
    })
      .populate("category", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      seller,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.isActive = !product.isActive;

    await product.save();

    res.status(200).json({
      message: "Status updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
