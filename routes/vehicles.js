const express = require("express")
const Vehicle = require("../models/Vehicle")
const VehicleLocation = require("../models/VehicleLocation")
const User = require("../models/User")
const { authenticateToken, requireAdminOrCoordinator } = require("../middleware/auth")
const { validateRequest, schemas } = require("../middleware/validation")

const router = express.Router()

// Get all vehicles
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, driver_id } = req.query

    const result = await Vehicle.findAll({ status, driver_id }, { page, limit })
    res.json(result)
  } catch (error) {
    console.error("Get vehicles error:", error)
    res.status(500).json({ error: "Failed to get vehicles" })
  }
})

// Get active vehicles with last known location
router.get("/active", authenticateToken, async (req, res) => {
  try {
    const vehicles = await Vehicle.findActive()
    res.json({ vehicles })
  } catch (error) {
    console.error("Get active vehicles error:", error)
    res.status(500).json({ error: "Failed to get active vehicles" })
  }
})

// Create vehicle
router.post(
  "/",
  authenticateToken,
  requireAdminOrCoordinator,
  validateRequest(schemas.createVehicle),
  async (req, res) => {
    try {
      const vehicle = await Vehicle.create(req.body)
      const vehicleWithDriver = await Vehicle.findById(vehicle.id)

      res.status(201).json({ vehicle: vehicleWithDriver })
    } catch (error) {
      if (error.code === "23505") {
        // PostgreSQL unique constraint violation
        return res.status(400).json({ error: "Vehicle number already exists" })
      }
      console.error("Create vehicle error:", error)
      res.status(500).json({ error: "Failed to create vehicle" })
    }
  },
)

// Update vehicle
router.patch(
  "/:id",
  authenticateToken,
  requireAdminOrCoordinator,
  validateRequest(schemas.updateVehicle),
  async (req, res) => {
    try {
      const { id } = req.params

      const existingVehicle = await Vehicle.findById(id)
      if (!existingVehicle) {
        return res.status(404).json({ error: "Vehicle not found" })
      }

      await Vehicle.update(id, req.body)
      const updatedVehicle = await Vehicle.findById(id)

      res.json({ vehicle: updatedVehicle })
    } catch (error) {
      console.error("Update vehicle error:", error)
      res.status(500).json({ error: "Failed to update vehicle" })
    }
  },
)

// Delete vehicle
router.delete("/:id", authenticateToken, requireAdminOrCoordinator, async (req, res) => {
  try {
    const { id } = req.params

    const vehicle = await Vehicle.delete(id)
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" })
    }

    res.json({ message: "Vehicle deleted successfully" })
  } catch (error) {
    console.error("Delete vehicle error:", error)
    res.status(500).json({ error: "Failed to delete vehicle" })
  }
})

// Assign driver to vehicle
router.post("/:id/assign-driver", authenticateToken, requireAdminOrCoordinator, async (req, res) => {
  try {
    const { id } = req.params
    const { driver_id } = req.body

    const vehicle = await Vehicle.findById(id)
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" })
    }

    if (driver_id) {
      const driver = await User.findById(driver_id)
      if (!driver || driver.role !== "driver" || driver.status !== "active") {
        return res.status(400).json({ error: "Invalid or inactive driver" })
      }
    }

    await Vehicle.update(id, { driver_id: driver_id || null })
    const updatedVehicle = await Vehicle.findById(id)

    res.json({ vehicle: updatedVehicle })
  } catch (error) {
    console.error("Assign driver error:", error)
    res.status(500).json({ error: "Failed to assign driver" })
  }
})

// Log vehicle location
router.post("/:id/location", authenticateToken, validateRequest(schemas.vehicleLocation), async (req, res) => {
  try {
    const { id } = req.params
    const { latitude, longitude, speed, heading } = req.body

    const vehicle = await Vehicle.findById(id)
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" })
    }

    // Check if user is the driver of this vehicle or has admin/coordinator role
    if (req.user.role === "driver" && vehicle.driver_id !== req.user.id) {
      return res.status(403).json({ error: "Can only log location for assigned vehicle" })
    }

    const location = await VehicleLocation.create({
      vehicle_id: id,
      latitude,
      longitude,
      speed,
      heading,
    })

    // Update vehicle last_active timestamp
    await Vehicle.updateLastActive(id)

    res.status(201).json({ location })
  } catch (error) {
    console.error("Log location error:", error)
    res.status(500).json({ error: "Failed to log location" })
  }
})

// Get vehicle location history
router.get("/:id/locations", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { start_date, end_date, limit = 100 } = req.query

    const vehicle = await Vehicle.findById(id)
    if (!vehicle) {
      return res.status(404).json({ error: "Vehicle not found" })
    }

    const locations = await VehicleLocation.findByVehicleId(id, { start_date, end_date, limit })
    res.json({ locations })
  } catch (error) {
    console.error("Get locations error:", error)
    res.status(500).json({ error: "Failed to get locations" })
  }
})

module.exports = router
