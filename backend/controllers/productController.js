import Product from "../models/Products.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "title");
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
      images,
      category,
      stockQuantity,
      rating,
      noOfRating,
      brand,
    } = req.body;

    const newProduct = new Product({
      title,
      description,
      mrpPrice,
      sellingPrice,
      images,
      category,
      stockQuantity,
      rating,
      noOfRating,
      brand,
    });

    await newProduct.save();
    return res.status(201).json({
      message: "Product created successfully",
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
      images,
      category,
      stockQuantity,
      rating,
      noOfRating,
      brand,
    } = req.body;

    const product = await Product.findById(id);
    if (!product || !product.isActive) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.mrpPrice = mrpPrice || product.mrpPrice;
    product.sellingPrice = sellingPrice || product.sellingPrice;
    product.images = images || product.images;
    product.category = category || product.category;
    product.stockQuantity = stockQuantity || product.stockQuantity;
    product.rating = rating || product.rating;
    product.noOfRating = noOfRating || product.noOfRatings;
    product.brand = brand || product.brand;

    await product.save();
    return res.status(200).json({
      message: "Product updated successfully",
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

    product.isActive = false;
    await product.save();
    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
