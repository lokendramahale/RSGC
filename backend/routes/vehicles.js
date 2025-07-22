const express = require("express");
const pool = require("../config/database");
const { authenticateToken, requireAdminOrCoordinator } = require("../middleware/auth");
const { validateRequest, schemas } = require("../middleware/validation");

const router = express.Router();

// Utility
const isValidId = (id) => /^[a-zA-Z0-9\-]+$/.test(id);

// 🔹 Get all vehicles with filters
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { status, driver_id, page = 1, limit = 100 } = req.query;
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(parseInt(limit) || 100, 1000);
    const offset = (pageNum - 1) * limitNum;

    let query = "SELECT * FROM vehicles WHERE 1=1";
    const values = [];

    if (status) {
      values.push(status);
      query += ` AND status = $${values.length}`;
    }

    if (driver_id) {
      if (!isValidId(driver_id)) {
        return res.status(400).json({ error: "Invalid driver ID" });
      }
      values.push(driver_id);
      query += ` AND driver_id = $${values.length}`;
    }

    values.push(limitNum, offset);
    query += ` ORDER BY last_active DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await pool.query(query, values);

    res.json({
      data: result.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.rowCount, // Note: You may want to run a separate COUNT(*) for exact total count
      },
    });
  } catch (err) {
    console.error("Get vehicles error:", err.stack);
    res.status(500).json({ error: "Failed to get vehicles" });
  }
});

// 🔹 Create vehicle
router.post(
  "/",
  authenticateToken,
  requireAdminOrCoordinator,
  validateRequest(schemas.createVehicle),
  async (req, res) => {
    try {
      const { id, driver_id, route } = req.body;

      const insertQuery = `
        INSERT INTO vehicles (id, driver_id, route)
        VALUES ($1, $2, $3)
        RETURNING *
      `;

      const result = await pool.query(insertQuery, [id, driver_id, route]);
      res.status(201).json(result.rows[0]);
    } catch (err) {
      if (err.code === "23505") {
        return res.status(400).json({ error: "Vehicle ID already exists" });
      }
      console.error("Create vehicle error:", err);
      res.status(500).json({ error: "Failed to create vehicle" });
    }
  }
);

// 🔹 Update vehicle
router.patch("/:id", authenticateToken, requireAdminOrCoordinator, validateRequest(schemas.updateVehicle), async (req, res) => {
  try {
    const { id } = req.params;
    const fields = Object.keys(req.body);
    const updates = fields.map((key, i) => `${key} = $${i + 2}`);
    const values = [id, ...fields.map(key => req.body[key])];

    const updateQuery = `
      UPDATE vehicles
      SET ${updates.join(", ")}
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update vehicle error:", err);
    res.status(500).json({ error: "Failed to update vehicle" });
  }
});

// 🔹 Delete vehicle
router.delete("/:id", authenticateToken, requireAdminOrCoordinator, async (req, res) => {
  try {
    const { id } = req.params;

    const check = await pool.query("SELECT 1 FROM vehicles WHERE id = $1", [id]);
    if (check.rowCount === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    await pool.query("DELETE FROM vehicles WHERE id = $1", [id]);
    res.json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    console.error("Delete vehicle error:", err);
    res.status(500).json({ error: "Failed to delete vehicle" });
  }
});

// 🔹 Assign driver to vehicle
router.post("/:id/assign-driver", authenticateToken, requireAdminOrCoordinator, async (req, res) => {
  try {
    const { id } = req.params;
    const { driver_id } = req.body;

    const vehicleCheck = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);
    if (vehicleCheck.rowCount === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    if (driver_id) {
      const driverCheck = await pool.query(
        "SELECT * FROM users WHERE id = $1 AND role = 'driver' AND status = 'active'",
        [driver_id]
      );
      if (driverCheck.rowCount === 0) {
        return res.status(400).json({ error: "Invalid or inactive driver" });
      }
    }

    const update = await pool.query(
      "UPDATE vehicles SET driver_id = $1 WHERE id = $2 RETURNING *",
      [driver_id || null, id]
    );

    res.json(update.rows[0]);
  } catch (err) {
    console.error("Assign driver error:", err);
    res.status(500).json({ error: "Failed to assign driver" });
  }
});

// 🔹 Log vehicle location
router.post("/:id/location", authenticateToken, validateRequest(schemas.vehicleLocation), async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, speed, heading } = req.body;

    const vehicle = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);
    if (vehicle.rowCount === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    if (req.user.role === "driver" && vehicle.rows[0].driver_id !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to log this vehicle's location" });
    }

    const insert = await pool.query(
      `INSERT INTO vehicle_locations (vehicle_id, latitude, longitude, speed, heading)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, latitude, longitude, speed, heading]
    );

    await pool.query("UPDATE vehicles SET last_active = NOW() WHERE id = $1", [id]);

    res.status(201).json(insert.rows[0]);
  } catch (err) {
    console.error("Log vehicle location error:", err);
    res.status(500).json({ error: "Failed to log location" });
  }
});

// 🔹 Get vehicle location history
router.get("/:id/locations", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, limit = 100 } = req.query;

    const vehicle = await pool.query("SELECT * FROM vehicles WHERE id = $1", [id]);
    if (vehicle.rowCount === 0) {
      return res.status(404).json({ error: "Vehicle not found" });
    }

    let query = "SELECT * FROM vehicle_locations WHERE vehicle_id = $1";
    const params = [id];
    let paramIndex = 2;

    if (start_date) {
      query += ` AND timestamp >= $${paramIndex++}`;
      params.push(start_date);
    }

    if (end_date) {
      query += ` AND timestamp <= $${paramIndex++}`;
      params.push(end_date);
    }

    query += ` ORDER BY timestamp DESC LIMIT $${paramIndex++}`;
    params.push(limit);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Get location history error:", err);
    res.status(500).json({ error: "Failed to fetch location history" });
  }
});

module.exports = router;
