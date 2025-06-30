const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { authenticateToken } = require("../middleware/auth")
const { validateRequest, schemas } = require("../middleware/validation")

const router = express.Router()

// Login
router.post("/login", validateRequest(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findByEmail(email)
    if (!user ) {
      return res.status(401).json({ error: "Invalid email" })
    }
    if( !(await User.comparePassword(password, user.password))){
      console.log(password, user.password);
      return res.status(401).json({ error: "Invalid password" })
    }

    if (user.status !== "active") {
      return res.status(401).json({ error: "Account is not active" })
    }

    // Update last login
    const updatedUser = await User.updateLastLogin(user.id)

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    })

    // Remove password from response
    const { password: _, ...userResponse } = updatedUser

    res.json({
      token,
      user: userResponse,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
})

// Get current user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ user })
  } catch (error) {
    console.error("Profile error:", error)
    res.status(500).json({ error: "Failed to get profile" })
  }
})

// Refresh token
router.post("/refresh", authenticateToken, async (req, res) => {
  try {
    const token = jwt.sign({ userId: req.user.id, role: req.user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    })

    res.json({ token })
  } catch (error) {
    console.error("Token refresh error:", error)
    res.status(500).json({ error: "Token refresh failed" })
  }
})

module.exports = router
