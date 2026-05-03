const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  removeItem,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:id", protect, removeItem);

module.exports = router;