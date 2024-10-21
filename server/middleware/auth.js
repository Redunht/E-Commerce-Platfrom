// server/middleware/auth.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = function (req, res, next) {
  // Get token from headers or cookies
  const token = req.headers["authorization"]?.split(" ")[1] || req.cookies.token;
  console.log("Token:", token);

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {id: decoded.userId }; // Adjusted to match the token structure
    console.log("Decoded token:", decoded);
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
