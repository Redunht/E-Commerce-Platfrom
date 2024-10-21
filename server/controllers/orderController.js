// server/controllers/orderController.js

const Order = require("../models/Order");


exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Only fetch orders for the authenticated user
    const orders = await Order.find()
      .populate("user")
      .populate("products.product");
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error getOrders");
  }
};

// Create a new order after successful payment
exports.createOrder = async (req, res) => {
  const { products, total, paymentIntentId, paymentMethod } = req.body;

  try {
    const newOrder = new Order({
      user: req.user.id,
      products,
      total,
      paymentIntentId,
      paymentMethod,
      status: "pending",
      paymentStatus: "paid",
    });

    const order = await newOrder.save();
    res.json(order);
  } catch (err) {
    console.error("Error creating order:", err.message);
    res.status(500).send("Server error CreateOrder");
  }
};