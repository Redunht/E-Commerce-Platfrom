// server/controllers/userController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, address, phone, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ name, email, password, address, phone, role });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error exports.register");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    // Create a session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address, // Add address if needed
      phone: user.phone, // Add phone if needed
    };

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true }); // Optionally set token as a cookie
    
    // Send the response with token and user info
    res.json({ token, user: { id: user._id, email: user.email, name: user.name} });
  
    //res.json({ msg: "Login successful", user: req.session.user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error exports.login");
  }

  
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error getUsers" });
  }
};
