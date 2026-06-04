import Category from "../models/Category.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActice: true });
    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category || !category.isActice) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    return res.status(200).json({
      message: "Category found successfully",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;

    const existingCategory = await category.findOne({ title });
    if (existingCategory) {
      return res.status(400).json({
        message: "category with this title already exist",
      });
    }

    const newCategory = new Category({
      title,
      description,
      imageUrl,
    });
    await newCategory.save();
    return res.status(201).json({
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl } = req.body;

    const category = await category.findOne(id);
    if (!category || !category.isActive) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    category.title = title || category.title;
    category.description = description || category.description;
    category.imageUrl = imageUrl || category.imageUrl;
    await category.save();
    res.status(200).json({
      message: "Category updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category || !category.isActice) {
      return res.status(404).json({
        message: "Category not found",
      });
    }
    category.isActice = false;
    await category.save();
    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
