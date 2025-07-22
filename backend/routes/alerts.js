const express = require("express")
const Alert = require("../models/Alert")
const { authenticateToken, requireAdminOrCoordinator } = require("../middleware/auth")

const router = express.Router()

// Get all alerts
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, severity } = req.query

    const result = await Alert.findAll({ status, type, severity }, { page, limit })
    res.json(result)
  } catch (error) {
    console.error("Get alerts error:", error)
    res.status(500).json({ error: "Failed to get alerts" })
  }
})

// Get active alerts (authenticateToken has been removed temporarily for testing)
router.get("/active",  async (req, res) => {
  try {
    const alerts = await Alert.findActive()
    res.json({ alerts })
  } catch (error) {
    console.error("Get active alerts error:", error)
    res.status(500).json({ error: "Failed to get active alerts" })
  }
})

// Acknowledge alert
router.patch("/:id/acknowledge", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const alert = await Alert.acknowledge(id)
    if (!alert) {
      return res.status(404).json({ error: "Alert not found or not active" })
    }

    res.json({ alert })
  } catch (error) {
    console.error("Acknowledge alert error:", error)
    res.status(500).json({ error: "Failed to acknowledge alert" })
  }
})

// Resolve alert
router.patch("/:id/resolve", authenticateToken, requireAdminOrCoordinator, async (req, res) => {
  try {
    const { id } = req.params
    const { notes } = req.body

    const alert = await Alert.resolve(id, req.user.id, notes)
    if (!alert) {
      return res.status(404).json({ error: "Alert not found or already resolved" })
    }

    const alertWithBin = await Alert.findById(id)
    res.json({ alert: alertWithBin })
  } catch (error) {
    console.error("Resolve alert error:", error)
    res.status(500).json({ error: "Failed to resolve alert" })
  }
})

module.exports = router
