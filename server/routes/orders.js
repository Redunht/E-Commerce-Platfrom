// server/routes/orders.js

const express = require("express");

const { getOrders, createOrder } = require("../controllers/orderController");
const auth = require("../middleware/auth"); // Authentication middleware

const Router = express.Router();

// @route   GET api/orders
// desc     Get all orders
// @access  Public
Router.get("/", getOrders);

// @route   POST api/orders
// @desc     Create an order
// @access  Private
Router.post("/", auth, createOrder);


module.exports = Router;
