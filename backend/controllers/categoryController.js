const Category = require("../models/Category");

// Get all categories with their subcategories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new category
exports.addCategory = async (req, res) => {
  try {
    const { name, subCategories } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name: name.toLowerCase(),
      subCategories: subCategories || [],
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add subcategory to an existing category
exports.addSubCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { subCategory } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if subcategory already exists (case insensitive)
    const exists = category.subCategories.some(
      sub => sub.toLowerCase() === subCategory.toLowerCase()
    );

    if (exists) {
      return res.status(400).json({ message: "Subcategory already exists" });
    }

    category.subCategories.push(subCategory.toLowerCase());
    await category.save();

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subCategories } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) category.name = name.toLowerCase();
    if (subCategories) category.subCategories = subCategories;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Soft delete - just deactivate
    category.isActive = false;
    await category.save();

    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};