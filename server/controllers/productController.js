// server/controllers/productController.js

const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error getProducts' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error('Error fetching product by id:', err);
    res.status(500).json({ message: "Server error getProductById" });
  }
};

exports.addProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).json({ message: "Server error addProduct" });
  }
};
