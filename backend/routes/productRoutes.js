const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  getSingleProduct
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// PUBLIC
router.get("/", getProducts);
router.get("/:id", getSingleProduct);

// ADMIN
router.post(
  "/",
  protect,
  admin,
  upload.array("images", 4), // max 4 images
  addProduct
);

router.put("/:id", protect, admin, upload.array("images", 4), updateProduct);

router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;