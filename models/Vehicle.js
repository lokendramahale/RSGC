const pool = require("../config/database")

class Vehicle {
  static async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, status, driver_id } = { ...filters, ...pagination }
    const offset = (page - 1) * limit

    let whereClause = "WHERE 1=1"
    const params = []
    let paramCount = 0

    if (status) {
      whereClause += ` AND v.status = $${++paramCount}`
      params.push(status)
    }

    if (driver_id) {
      whereClause += ` AND v.driver_id = $${++paramCount}`
      params.push(driver_id)
    }

    const countQuery = `SELECT COUNT(*) FROM vehicles v ${whereClause}`
    const dataQuery = `
      SELECT 
        v.id, v.number, v.capacity, v.status, v.driver_id, v.last_active, 
        v.fuel_level, v.mileage, v.created_at, v.updated_at,
        u.id as driver_user_id, u.name as driver_name, u.email as driver_email, u.phone as driver_phone
      FROM vehicles v
      LEFT JOIN users u ON v.driver_id = u.id
      ${whereClause}
      ORDER BY v.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `

    params.push(limit, offset)

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, params.slice(0, -2)),
      pool.query(dataQuery, params),
    ])

    const vehicles = dataResult.rows.map((row) => ({
      id: row.id,
      number: row.number,
      capacity: Number.parseFloat(row.capacity),
      status: row.status,
      driver_id: row.driver_id,
      last_active: row.last_active,
      fuel_level: row.fuel_level ? Number.parseFloat(row.fuel_level) : null,
      mileage: Number.parseFloat(row.mileage),
      created_at: row.created_at,
      updated_at: row.updated_at,
      driver: row.driver_user_id
        ? {
            id: row.driver_user_id,
            name: row.driver_name,
            email: row.driver_email,
            phone: row.driver_phone,
          }
        : null,
    }))

    return {
      vehicles,
      total: Number.parseInt(countResult.rows[0].count),
      page: Number.parseInt(page),
      pages: Math.ceil(Number.parseInt(countResult.rows[0].count) / limit),
      limit: Number.parseInt(limit),
    }
  }

  static async findById(id) {
    const query = `
      SELECT 
        v.id, v.number, v.capacity, v.status, v.driver_id, v.last_active, 
        v.fuel_level, v.mileage, v.created_at, v.updated_at,
        u.id as driver_user_id, u.name as driver_name, u.email as driver_email, u.phone as driver_phone
      FROM vehicles v
      LEFT JOIN users u ON v.driver_id = u.id
      WHERE v.id = $1
    `
    const result = await pool.query(query, [id])

    if (result.rows.length === 0) return null

    const row = result.rows[0]
    return {
      id: row.id,
      number: row.number,
      capacity: Number.parseFloat(row.capacity),
      status: row.status,
      driver_id: row.driver_id,
      last_active: row.last_active,
      fuel_level: row.fuel_level ? Number.parseFloat(row.fuel_level) : null,
      mileage: Number.parseFloat(row.mileage),
      created_at: row.created_at,
      updated_at: row.updated_at,
      driver: row.driver_user_id
        ? {
            id: row.driver_user_id,
            name: row.driver_name,
            email: row.driver_email,
            phone: row.driver_phone,
          }
        : null,
    }
  }

  static async findActive() {
    const query = `
      SELECT 
        v.id, v.number, v.capacity, v.status, v.driver_id, v.last_active, 
        v.fuel_level, v.mileage,
        u.id as driver_user_id, u.name as driver_name, u.phone as driver_phone,
        vl.latitude, vl.longitude, vl.speed, vl.heading, vl.timestamp as location_timestamp
      FROM vehicles v
      LEFT JOIN users u ON v.driver_id = u.id
      LEFT JOIN LATERAL (
        SELECT latitude, longitude, speed, heading, timestamp
        FROM vehicle_locations 
        WHERE vehicle_id = v.id 
        ORDER BY timestamp DESC 
        LIMIT 1
      ) vl ON true
      WHERE v.status = 'active'
      ORDER BY v.number
    `

    const result = await pool.query(query)

    return result.rows.map((row) => ({
      id: row.id,
      number: row.number,
      capacity: Number.parseFloat(row.capacity),
      status: row.status,
      driver_id: row.driver_id,
      last_active: row.last_active,
      fuel_level: row.fuel_level ? Number.parseFloat(row.fuel_level) : null,
      mileage: Number.parseFloat(row.mileage),
      driver: row.driver_user_id
        ? {
            id: row.driver_user_id,
            name: row.driver_name,
            phone: row.driver_phone,
          }
        : null,
      last_location: row.latitude
        ? {
            latitude: Number.parseFloat(row.latitude),
            longitude: Number.parseFloat(row.longitude),
            speed: row.speed ? Number.parseFloat(row.speed) : null,
            heading: row.heading ? Number.parseFloat(row.heading) : null,
            timestamp: row.location_timestamp,
          }
        : null,
    }))
  }

  static async create(vehicleData) {
    const { number, capacity, driver_id, fuel_level } = vehicleData

    const query = `
      INSERT INTO vehicles (number, capacity, driver_id, fuel_level)
      VALUES ($1, $2, $3, $4)
      RETURNING id, number, capacity, status, driver_id, last_active, fuel_level, mileage, created_at, updated_at
    `

    const result = await pool.query(query, [number, capacity, driver_id || null, fuel_level || null])
    return result.rows[0]
  }

  static async update(id, vehicleData) {
    const fields = []
    const values = []
    let paramCount = 0

    for (const [key, value] of Object.entries(vehicleData)) {
      if (value !== undefined && key !== "id") {
        fields.push(`${key} = $${++paramCount}`)
        values.push(value)
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update")
    }

    values.push(id)
    const query = `
      UPDATE vehicles SET ${fields.join(", ")}
      WHERE id = $${++paramCount}
      RETURNING id, number, capacity, status, driver_id, last_active, fuel_level, mileage, created_at, updated_at
    `

    const result = await pool.query(query, values)
    return result.rows[0]
  }

  static async delete(id) {
    const query = "DELETE FROM vehicles WHERE id = $1 RETURNING id"
    const result = await pool.query(query, [id])
    return result.rows[0] || null
  }

  static async updateLastActive(id) {
    const query = `
      UPDATE vehicles SET last_active = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id
    `
    const result = await pool.query(query, [id])
    return result.rows[0]
  }
}

module.exports = Vehicle
