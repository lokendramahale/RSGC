const express = require("express")
const Bin = require("../models/Bin")
const Alert = require("../models/Alert")
const { authenticateToken, requireAdminOrCoordinator } = require("../middleware/auth")
const { validateRequest, schemas } = require("../middleware/validation")

const router = express.Router()

// GET: Get all bins with optional filters
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, area, status, fill_level_min, fill_level_max } = req.query
    
    const result = await Bin.findAll(
      { area, status, fill_level_min, fill_level_max },
      { page: parseInt(page), limit: parseInt(limit) }
    )
    
     console.log('fetched bins:',result);
    const bins = result.bins.map((bin) => ({
      id: bin.id,
      location_name: bin.location_name,
      area: bin.area,
      fill_level: bin.fill_level,
      status: bin.status,
      last_collected: bin.last_collected,
    }))

    res.json(bins)
  } catch (error) {
    console.error("Get bins error:", error)
    res.status(500).json({ error: "Failed to get bins" })
  }
})

// GET: Get bins with active alerts
router.get("/alerts", authenticateToken, async (req, res) => {
  try {
    const bins = await Bin.findWithAlerts()
    res.json({ bins })
  } catch (error) {
    console.error("Get bins with alerts error:", error)
    res.status(500).json({ error: "Failed to get bins with alerts" })
  }
})

// GET: Get nearby bins
router.get("/nearby", authenticateToken, async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude are required" })
    }

    const bins = await Bin.findNearby(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius)
    )

    res.json({ bins })
  } catch (error) {
    console.error("Get nearby bins error:", error)
    res.status(500).json({ error: "Failed to get nearby bins" })
  }
})

// POST: Create a new bin
router.post("/", authenticateToken, requireAdminOrCoordinator, validateRequest(schemas.createBin), async (req, res) => {
  
  try {
    const bin = await Bin.create(req.body)
    res.status(201).json({ bin })
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "Sensor ID already exists" })
    }
   console.error("Create bin error:", error, error.stack)
    res.status(500).json({ error: "Failed to create bin" })
  }
})

// PATCH: Update an existing bin

router.patch("/:id", authenticateToken, validateRequest(schemas.updateBin), async (req, res) => {
  try {
    const { id } = req.params
    const existingBin = await Bin.findById(id)

    if (!existingBin) {
      return res.status(404).json({ error: "Bin not found" })
    }

    const oldFillLevel = existingBin.fill_level
    const updateData = { ...req.body }

    if (req.body.status !== undefined) updateData.status = req.body.status
    if (req.body.area !== undefined) updateData.area = req.body.area
    if (req.body.location_name !== undefined) updateData.location_name = req.body.location_name

    const bin = await Bin.update(id, updateData)

    // Trigger alerts
    if (req.body.fill_level && req.body.fill_level > 90 && oldFillLevel <= 90) {
      await Alert.create({
        bin_id: id,
        type: "overflow",
        severity: req.body.fill_level > 95 ? "critical" : "high",
        message: `Bin at ${bin.location_name} is ${req.body.fill_level}% full`,
      })
      await Bin.update(id, { status: "overflow" })
    }

    if (req.body.gas_level && req.body.gas_level > 50) {
      await Alert.create({
        bin_id: id,
        type: "gas_leak",
        severity: req.body.gas_level > 80 ? "critical" : "high",
        message: `High gas level detected at ${bin.location_name}`,
      })
    }

    if (req.body.temperature && req.body.temperature > 60) {
      await Alert.create({
        bin_id: id,
        type: "fire",
        severity: "critical",
        message: `High temperature detected at ${bin.location_name}`,
      })
    }

    res.json({ bin })
  } catch (error) {
    console.error("Update bin error:", error)
    res.status(500).json({ error: "Failed to update bin" })
  }
})



// DELETE: Delete a bin
router.delete("/:id", authenticateToken, requireAdminOrCoordinator, async (req, res) => {
  try {
    const { id } = req.params
    const bin = await Bin.delete(id)

    if (!bin) {
      return res.status(404).json({ error: "Bin not found" })
    }

    res.json({ message: "Bin deleted successfully" })
  } catch (error) {
    console.error("Delete bin error:", error)
    res.status(500).json({ error: "Failed to delete bin" })
  }
})

module.exports = router
