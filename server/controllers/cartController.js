// server/controllers/cartController.js
const User = require("../models/User");
const Product = require("../models/Product");

// Get Cart Items for the Authenticated User
exports.getCart = async (req, res) => {
  console.log("Checking getCart...");
  try {
    const userId = req.user.id; // Assuming user ID is available in req.user
    const user = await User.findById(userId).populate("cart.product");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user.cart);
  } catch (err) {
    console.error("Error fetching cart:", err.message);
    res.status(500).send("Server error getCart");
  }
};

// Update Cart Items for the Authenticated User
exports.updateCart = async (req, res) => {
  console.log("Checking updateCart...", req.user);
  try {
    const userId = req.user.id;
    console.log("UserId acquired:", userId);
    const { cart } = req.body; // Expecting an array of { productId, quantity }

    console.log("Deconstruction passed");
    // Validate products
    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ msg: `Product not found: ${item.productId}` });
      }
      if (item.quantity > product.stock) {
        return res
          .status(400)
          .json({ msg: `Insufficient stock for product: ${product.name}` });
      }
    }
    console.log("Products validated");

    //Update cart
    const updatedCart = cart.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
    }));
    console.log("Cart updated");

    await User.findByIdAndUpdate(userId, { cart: updatedCart }, { new: true });

    res.json({ msg: "Cart updated successfully" });
  } catch (err) {
    console.error("Error updating cart:", err.message);
    res.status(500).send("Server error updateCart");
  }
};

// Clear Cart after Successful Checkout
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, { cart: [] }, { new: true });
    res.json({ msg: "Cart cleared successfully" });
  } catch (err) {
    console.error("Error clearing cart:", err.message);
    res.status(500).send("Server error clearCart");
  }
};

