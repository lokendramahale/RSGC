const express = require("express")
const CollectionLog = require("../models/CollectionLog")
const Bin = require("../models/Bin")
const Vehicle = require("../models/Vehicle")
const Alert = require("../models/Alert")
const { authenticateToken } = require("../middleware/auth")
const { validateRequest, schemas } = require("../middleware/validation")
const upload = require("../middleware/upload")

const router = express.Router()

// Get all collection logs
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, start_date, end_date, bin_id, vehicle_id } = req.query

    const result = await CollectionLog.findAll({ start_date, end_date, bin_id, vehicle_id }, { page, limit })
    res.json(result)
  } catch (error) {
    console.error("Get collections error:", error)
    res.status(500).json({ error: "Failed to get collections" })
  }
})

// Get collections by bin
router.get("/bin/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { limit = 10 } = req.query

    const collections = await CollectionLog.findByBinId(id, Number.parseInt(limit))
    res.json({ collections })
  } catch (error) {
    console.error("Get collections by bin error:", error)
    res.status(500).json({ error: "Failed to get collections" })
  }
})

// Get collections by vehicle
router.get("/vehicle/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { limit = 10 } = req.query

    const collections = await CollectionLog.findByVehicleId(id, Number.parseInt(limit))
    res.json({ collections })
  } catch (error) {
    console.error("Get collections by vehicle error:", error)
    res.status(500).json({ error: "Failed to get collections" })
  }
})

// Create collection log
router.post(
  "/",
  authenticateToken,
  upload.single("photo"),
  validateRequest(schemas.createCollection),
  async (req, res) => {
    try {
      const { bin_id, vehicle_id, fill_before, fill_after, weight_collected, notes } = req.body

      // Verify bin and vehicle exist
      const bin = await Bin.findById(bin_id)
      const vehicle = await Vehicle.findById(vehicle_id)

      if (!bin) {
        return res.status(404).json({ error: "Bin not found" })
      }
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" })
      }

      // Check if user is authorized to create collection for this vehicle
      if (req.user.role === "driver" && vehicle.driver_id !== req.user.id) {
        return res.status(403).json({ error: "Can only log collections for assigned vehicle" })
      }

      const collectionData = {
        bin_id,
        vehicle_id,
        collected_by: req.user.id,
        fill_before: Number.parseFloat(fill_before),
        fill_after: Number.parseFloat(fill_after),
        weight_collected: weight_collected ? Number.parseFloat(weight_collected) : null,
        notes,
        photo_url: req.file ? `/uploads/${req.file.filename}` : null,
      }

      const collection = await CollectionLog.create(collectionData)

      // Update bin fill level and last collected time
      await Bin.update(bin_id, {
        fill_level: Number.parseFloat(fill_after),
        last_collected: new Date(),
        status: Number.parseFloat(fill_after) < 90 ? "active" : "full",
      })

      // Resolve any overflow alerts for this bin
      await Alert.resolveByBinAndType(bin_id, "overflow", req.user.id)

      const collectionWithDetails = await CollectionLog.findById(collection.id)
      res.status(201).json({ collection: collectionWithDetails })
    } catch (error) {
      console.error("Create collection error:", error)
      res.status(500).json({ error: "Failed to create collection" })
    }
  },
)

module.exports = router
