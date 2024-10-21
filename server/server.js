// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const Product = require("./models/Product"); // Import the Product model
const auth = require("./middleware/auth"); // Import the auth middleware
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: { secure: process.env.NODE_ENV === "production", maxAge: 3600000 },
  })
);
// Use routes
app.use("/api/users", require("./routes/user"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/cart", require("./routes/cart")); // Added cart routes

// Test Route
app.get("/api/test", auth, (req, res) => {
  console.log("Authenticated user:", req.user);
  res.json({ user: req.user });
});


// Stripe Setup
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const productIds = req.body.items.map((item) => item.id);

    // Fetch the products from MongoDB based on the ids
    const products = await Product.find({ _id: { $in: productIds } });

    if (!products.length) {
      return res.status(404).json({ error: "Products not found" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => {
        const storeItem = products.find(
          (product) => product._id.toString() === item.id
        );
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: Math.round(storeItem.price * 100), // Assuming price is in dollars
          },
          quantity: item.quantity,
        };
      }),
      success_url: `${process.env.CLIENT_URL}/home`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
