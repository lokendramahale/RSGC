const pool = require("../config/database")

class VehicleLocation {
  static async create(locationData) {
    const { vehicle_id, latitude, longitude, speed, heading } = locationData

    const query = `
      INSERT INTO vehicle_locations (vehicle_id, latitude, longitude, speed, heading)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, vehicle_id, latitude, longitude, speed, heading, timestamp
    `

    const result = await pool.query(query, [vehicle_id, latitude, longitude, speed || 0, heading || null])
    const row = result.rows[0]

    return {
      id: row.id,
      vehicle_id: row.vehicle_id,
      latitude: Number.parseFloat(row.latitude),
      longitude: Number.parseFloat(row.longitude),
      speed: row.speed ? Number.parseFloat(row.speed) : 0,
      heading: row.heading ? Number.parseFloat(row.heading) : null,
      timestamp: row.timestamp,
    }
  }

  static async findByVehicleId(vehicleId, filters = {}) {
    const { start_date, end_date, limit = 100 } = filters

    let whereClause = "WHERE vehicle_id = $1"
    const params = [vehicleId]
    let paramCount = 1

    if (start_date) {
      whereClause += ` AND timestamp >= $${++paramCount}`
      params.push(start_date)
    }

    if (end_date) {
      whereClause += ` AND timestamp <= $${++paramCount}`
      params.push(end_date)
    }

    const query = `
      SELECT id, vehicle_id, latitude, longitude, speed, heading, timestamp
      FROM vehicle_locations
      ${whereClause}
      ORDER BY timestamp DESC
      LIMIT $${++paramCount}
    `

    params.push(limit)
    const result = await pool.query(query, params)

    return result.rows.map((row) => ({
      id: row.id,
      vehicle_id: row.vehicle_id,
      latitude: Number.parseFloat(row.latitude),
      longitude: Number.parseFloat(row.longitude),
      speed: row.speed ? Number.parseFloat(row.speed) : 0,
      heading: row.heading ? Number.parseFloat(row.heading) : null,
      timestamp: row.timestamp,
    }))
  }

  static async getLatestByVehicleId(vehicleId) {
    const query = `
      SELECT id, vehicle_id, latitude, longitude, speed, heading, timestamp
      FROM vehicle_locations
      WHERE vehicle_id = $1
      ORDER BY timestamp DESC
      LIMIT 1
    `

    const result = await pool.query(query, [vehicleId])

    if (result.rows.length === 0) return null

    const row = result.rows[0]
    return {
      id: row.id,
      vehicle_id: row.vehicle_id,
      latitude: Number.parseFloat(row.latitude),
      longitude: Number.parseFloat(row.longitude),
      speed: row.speed ? Number.parseFloat(row.speed) : 0,
      heading: row.heading ? Number.parseFloat(row.heading) : null,
      timestamp: row.timestamp,
    }
  }
}

module.exports = VehicleLocation
