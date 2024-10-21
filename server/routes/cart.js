//server/routes/cart.js
const express = require("express");
const router = express.Router();
const {
  getCart,
  updateCart,
  clearCart,
} = require("../controllers/cartController");
const auth = require("../middleware/auth"); // Middleware to authenticate user

// @route   GET api/cart
// @desc    Get cart items
// @access  Private
router.get("/", auth, getCart);

// @route   POST api/cart
// @desc    Update cart items
// @access  Private
router.post("/", auth, updateCart);

// @route   DELETE api/cart
// @desc    Clear cart
// @access  Private
router.delete("/", auth, clearCart);

module.exports = router;
