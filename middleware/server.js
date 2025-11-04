const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const verifyToken = require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

// Hardcoded sample user
const user = {
  username: "john",
  password: "password123",
  email: "john@example.com"
};

// Public route
app.get("/", (req, res) => {
  res.send("Welcome to the JWT Protected Routes Example API");
});

// Login route (generate token)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === user.username && password === user.password) {
    const token = jwt.sign(
      { username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Protected route (requires JWT)
app.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message: "Welcome to your dashboard!",
    user: req.user
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
