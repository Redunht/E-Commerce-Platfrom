// server/routes/products.js

const express = require("express");
const {
  getProducts,
  getProductById,
  addProduct,
} = require("../controllers/productController");

const router = express.Router();

// @route   GET api/products
// desc     Get all products
// @access  Public
router.get(
  "/",
  (req, res, next) => {
    console.log("GET request to /api/products");
    next();
  },
  getProducts
);

// @route   GET api/products/:id
// @desc    Get a product by ID
// @access  Public
router.get(
  "/:id",
  (req, res, next) => {
    console.log(`GET request to /api/products/${req.params.id}`);
    next();
  },
  getProductById
);

// @route   POST api/products
// desc     Add a product
// @access  Public
router.post(
  "/",
  (req, res, next) => {
    console.log("POST request to /api/products");
    next();
  },
  addProduct
);

module.exports = router;
