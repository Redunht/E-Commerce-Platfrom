//  server/routes/user.js

const express = require("express");
const { register, login, getUsers } = require("../controllers/userController");

const router = express.Router();

// Middleware function
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ msg: "Unauthorized" });
  }
};

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", register);

// @route   POST api/user/login
// @desc    login user
// @access  Public
router.post("/login", login);

// Logout route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ msg: "Failed to logout" });
    }
    res.clearCookie('connect.sid'); // Clean up the session cookie
    res.json({ msg: "Logout successful" });
  });
});

// Example protected route
router.get("/protected-route", isAuthenticated, (req, res) => {
  res.json({ msg: "This is a protected route" });
});

// @route   GET api/users
// desc     Get all users
// @access  Public
router.get(
  "/",
  (req, res, next) => {
    console.log("GET request to /api/users");
    next();
  },
  getUsers
);

module.exports = router;
