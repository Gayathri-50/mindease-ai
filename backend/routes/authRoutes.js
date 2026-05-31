const jwt = require("jsonwebtoken");
const express = require("express");
console.log("Auth Routes Loaded");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});
router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not configured for auth login");
      return res.status(500).json({
        message: "Server configuration error: missing JWT secret",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

});
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
router.get("/test", (req, res) => {
  res.send("Auth Route Working");
});
module.exports = router;