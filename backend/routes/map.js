const express = require("express")
const router = express.Router()
const pool = require("../config/database")
const { authenticateToken, requireAdmin } = require("../middleware/auth")

// GET all bins
router.get("/binLocations", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, latitude AS lat, longitude AS lng, status, fill_level FROM bins"
    )
    res.json({ bins: rows })
  } catch (err) {
    console.error("Failed to fetch bins", err)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET all vehicle locations
router.get("/vehicleLocations", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT v.id, v.status, vl.latitude AS lat, vl.longitude AS lng, 
             u.name AS driver, vl.timestamp, vl.speed, vl.heading
      FROM vehicles v
      JOIN vehicle_locations vl ON v.id = vl.vehicle_id
      JOIN users u ON v.driver_id = u.id
      ORDER BY v.id, vl.timestamp ASC
    `);

    res.json({ vehicles: rows });
  } catch (err) {
    console.error("Failed to fetch vehicles", err);
    res.status(500).json({ error: "ternal server error" });
  }
});


// Update vehicle location
router.post("/updateLocation", async (req, res) => {
  const { vehicle_id, latitude, longitude, speed, heading, timestamp, driver, phone} = req.body;

  if (!vehicle_id || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const insertQuery = `
      INSERT INTO vehicle_locations (vehicle_id, latitude, longitude, speed, heading, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await pool.query(insertQuery, [
      vehicle_id,
      latitude,
      longitude,
      speed || 0,
      heading || null,
      timestamp || new Date(),
    ]);

    // Emit over Socket.IO
    req.app.get("io").emit("vehicle-location", {
      vehicle_id,
      latitude,
      longitude,
      speed,
      heading,
      timestamp: timestamp || new Date(),
      driver: driver || null,
      phone: phone || null,
    });

    res.status(201).json({ message: "Location updated" });
  }  catch (err) {
    console.error("🚨 SQL Error in /updateLocation:", err.message, err.stack);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});


module.exports = router
