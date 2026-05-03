const express = require("express");
const router = express.Router();
const {
  getCategories,
  addCategory,
  addSubCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public - get all categories (for product page filters)
router.get("/", getCategories);

// Admin routes
router.post("/", protect, admin, addCategory);
router.post("/:categoryId/subcategory", protect, admin, addSubCategory);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;