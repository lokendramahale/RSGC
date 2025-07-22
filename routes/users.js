const express = require("express")
const User = require("../models/User")
const { authenticateToken, requireAdmin } = require("../middleware/auth")
const { validateRequest, schemas } = require("../middleware/validation")

const router = express.Router()

// Get all users (admin only)
// 📁 routes/user.js or wherever your user routes are defined
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    // 🔹 Read query params from request URL
    const { page = 1, limit = 10, role, status } = req.query

    // 🔹 Call the model with correct arguments
    const result = await User.findAll(
      { role, status }, // <-- filters object
      { page: parseInt(page), limit: parseInt(limit) } // <-- pagination object
    )

    // 🔹 Return the data
    res.json(result)
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ error: "Failed to get users" })
  }
})


// Create user (admin only)
router.post("/", authenticateToken, requireAdmin, validateRequest(schemas.createUser), async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json({ user })
  } catch (error) {
    if (error.code === "23505") {
      // PostgreSQL unique constraint violation
      return res.status(400).json({ error: "Email already exists" })
    }
    console.error("Create user error:", error)
    res.status(500).json({ error: "Failed to create user" })
  }
})

// Update user
router.patch("/:id", authenticateToken, validateRequest(schemas.updateUser), async (req, res) => {
  try {
    const { id } = req.params

    // Users can only update their own profile unless they're admin
    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ error: "Can only update your own profile" })
    }

    const existingUser = await User.findById(id)
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" })
    }

    // Only admin can change role and status
    if (req.user.role !== "admin") {
      delete req.body.role
      delete req.body.status
    }

    const user = await User.update(id, req.body)
    res.json({ user })
  } catch (error) {
    console.error("Update user error:", error)
    res.status(500).json({ error: "Failed to update user" })
  }
})

// Delete user (admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params

    if (req.user.id === id) {
      return res.status(400).json({ error: "Cannot delete your own account" })
    }

    const user = await User.delete(id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({ error: "Failed to delete user" })
  }
})

// Reset password (admin only)
router.patch("/:id/reset-password", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { password } = req.body

    if (!password || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" })
    }

    const existingUser = await User.findById(id)
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" })
    }

    await User.update(id, { password })
    res.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Reset password error:", error)
    res.status(500).json({ error: "Failed to reset password" })
  }
})

module.exports = router
