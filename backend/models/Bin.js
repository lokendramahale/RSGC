const pool = require("../config/database")

class Bin {
  static async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, area, status, fill_level_min, fill_level_max } = { ...filters, ...pagination }
    const offset = (page - 1) * limit

    let whereClause = "WHERE 1=1"
    const params = []
    let paramCount = 0

    if (area) {
      whereClause += ` AND b.area = $${++paramCount}`
      params.push(area)
    }

    if (status) {
      whereClause += ` AND b.status = $${++paramCount}`
      params.push(status)
    }

    if (fill_level_min !== undefined) {
      whereClause += ` AND b.fill_level >= $${++paramCount}`
      params.push(fill_level_min)
    }

    if (fill_level_max !== undefined) {
      whereClause += ` AND b.fill_level <= $${++paramCount}`
      params.push(fill_level_max)
    }

    const countQuery = `SELECT COUNT(*) FROM bins b ${whereClause}`
    const dataQuery = `
      SELECT 
        b.id, b.location_name, b.latitude, b.longitude, b.area, b.fill_level, 
        b.capacity, b.status, b.last_collected, b.sensor_id, b.temperature, 
        b.gas_level, b.created_at, b.updated_at,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', a.id,
              'type', a.type,
              'severity', a.severity,
              'status', a.status,
              'message', a.message,
              'triggered_at', a.triggered_at
            )
          ) FILTER (WHERE a.id IS NOT NULL), 
          '[]'
        ) as alerts
      FROM bins b
      LEFT JOIN alerts a ON b.id = a.bin_id AND a.status = 'active'
      ${whereClause}
      GROUP BY b.id, b.location_name, b.latitude, b.longitude, b.area, b.fill_level, 
               b.capacity, b.status, b.last_collected, b.sensor_id, b.temperature, 
               b.gas_level, b.created_at, b.updated_at
      ORDER BY b.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `

    params.push(limit, offset)

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, params.slice(0, -2)),
      pool.query(dataQuery, params),
    ])

    const bins = dataResult.rows.map((row) => ({
      id: row.id,
      location_name: row.location_name,
      latitude: Number.parseFloat(row.latitude),
      longitude: Number.parseFloat(row.longitude),
      area: row.area,
      fill_level: Number.parseFloat(row.fill_level),
      capacity: Number.parseFloat(row.capacity),
      status: row.status,
      last_collected: row.last_collected,
      sensor_id: row.sensor_id,
      temperature: row.temperature ? Number.parseFloat(row.temperature) : null,
      gas_level: Number.parseFloat(row.gas_level),
      created_at: row.created_at,
      updated_at: row.updated_at,
      alerts: row.alerts,
    }))

    return {
      bins,
      total: Number.parseInt(countResult.rows[0].count),
      page: Number.parseInt(page),
      pages: Math.ceil(Number.parseInt(countResult.rows[0].count) / limit),
      limit: Number.parseInt(limit),
    }
  }

  static async findById(id) {
    const query = `
      SELECT 
        b.id, b.location_name, b.latitude, b.longitude, b.area, b.fill_level, 
        b.capacity, b.status, b.last_collected, b.sensor_id, b.temperature, 
        b.gas_level, b.created_at, b.updated_at,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', a.id,
              'type', a.type,
              'severity', a.severity,
              'status', a.status,
              'message', a.message,
              'triggered_at', a.triggered_at
            )
          ) FILTER (WHERE a.id IS NOT NULL), 
          '[]'
        ) as alerts
      FROM bins b
      LEFT JOIN alerts a ON b.id = a.bin_id AND a.status = 'active'
      WHERE b.id = $1
      GROUP BY b.id, b.location_name, b.latitude, b.longitude, b.area, b.fill_level, 
               b.capacity, b.status, b.last_collected, b.sensor_id, b.temperature, 
               b.gas_level, b.created_at, b.updated_at
    `

    const result = await pool.query(query, [id])

    if (result.rows.length === 0) return null

    const row = result.rows[0]
    return {
      id: row.id,
      location_name: row.location_name,
      latitude: Number.parseFloat(row.latitude),
      longitude: Number.parseFloat(row.longitude),
      area: row.area,
      fill_level: Number.parseFloat(row.fill_level),
      capacity: Number.parseFloat(row.capacity),
      status: row.status,
      last_collected: row.last_collected,
      sensor_id: row.sensor_id,
      temperature: row.temperature ? Number.parseFloat(row.temperature) : null,
      gas_level: Number.parseFloat(row.gas_level),
      created_at: row.created_at,
      updated_at: row.updated_at,
      alerts: row.alerts,
    }
  }

  static async findWithAlerts() {
    const query = `
      SELECT 
        b.id, b.location_name, b.latitude, b.longitude, b.area, b.fill_level, 
        b.capacity, b.status, b.last_collected, b.sensor_id, b.temperature, 
        b.gas_level, b.created_at, b.updated_at,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', a.id,
            'type', a.type,
            'severity', a.severity,
            'status', a.status,
            'message', a.message,
            'triggered_at', a.triggered_at
          )
        ) as alerts
      FROM bins b
      INNER JOIN alerts a ON b.id = a.bin_id AND a.status = 'active'
      GROUP BY b.id, b.location_name, b.latitude, b.longitude, b.area, b.fill_level, 
               b.capacity, b.status, b.last_collected, b.sensor_id, b.temperature, 
               b.gas_level, b.created_at, b.updated_at
      ORDER BY a.triggered_at DESC
    `

    const result = await pool.query(query)

    return result.rows.map((row) => ({
      id: row.id,
      location_name: row.location_name,
      latitude: Number.parseFloat(row.latitude),
      longitude: Number.parseFloat(row.longitude),
      area: row.area,
      fill_level: Number.parseFloat(row.fill_level),
      capacity: Number.parseFloat(row.capacity),
      status: row.status,
      last_collected: row.last_collected,
      sensor_id: row.sensor_id,
      temperature: row.temperature ? Number.parseFloat(row.temperature) : null,
      gas_level: Number.parseFloat(row.gas_level),
      created_at: row.created_at,
      updated_at: row.updated_at,
      alerts: row.alerts,
    }))
  }

  static async findNearby(lat, lng, radius = 5) {
    // Simple distance calculation using Haversine formula approximation
    const query = `
      SELECT 
        b.id, b.location_name, b.latitude, b.longitude, b.area, b.fill_level, 
        b.capacity, b.status, b.last_collected, b.sensor_id, b.temperature, 
        b.gas_level, b.created_at, b.updated_at,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', a.id,
              'type', a.type,
              'severity', a.severity,
              'status', a.status,
              'message', a.message,
              'triggered_at', a.triggered_at
            )
          ) FILTER (WHERE a.id IS NOT NULL), 
          '[]'
        ) as alerts,
        (
          6371 * acos(
            cos(radians($1)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians($2)) + 
            sin(radians($1)) * sin(radians(latitude))
          )
        ) AS distance
      FROM bins b
      LEFT JOIN alerts a ON b.id = a.bin_id AND a.status = 'active'
      GROUP BY b.id, b.location_name, b.latitude, b.longitude, b.area, b.fill_level, 
               b.capacity, b.status, b.last_collected, b.sensor_id, b.temperature, 
               b.gas_level, b.created_at, b.updated_at
      HAVING (
        6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians($2)) + 
          sin(radians($1)) * sin(radians(latitude))
        )
      ) <= $3
      ORDER BY distance
    `

    const result = await pool.query(query, [lat, lng, radius])

    return result.rows.map((row) => ({
      id: row.id,
      location_name: row.location_name,
      latitude: Number.parseFloat(row.latitude),
      longitude: Number.parseFloat(row.longitude),
      area: row.area,
      fill_level: Number.parseFloat(row.fill_level),
      capacity: Number.parseFloat(row.capacity),
      status: row.status,
      last_collected: row.last_collected,
      sensor_id: row.sensor_id,
      temperature: row.temperature ? Number.parseFloat(row.temperature) : null,
      gas_level: Number.parseFloat(row.gas_level),
      created_at: row.created_at,
      updated_at: row.updated_at,
      alerts: row.alerts,
      distance: Number.parseFloat(row.distance),
    }))
  }

  static async create(binData) {
    const { location_name, latitude, longitude, area, capacity, sensor_id } = binData

    const query = `
      INSERT INTO bins (location_name, latitude, longitude, area, capacity, sensor_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, location_name, latitude, longitude, area, fill_level, capacity, 
                status, last_collected, sensor_id, temperature, gas_level, created_at, updated_at
    `

    const result = await pool.query(query, [location_name, latitude, longitude, area, capacity, sensor_id || null])
    const row = result.rows[0]

    return {
      id: row.id,
      location_name: row.location_name,
      latitude: Number.parseFloat(row.latitude),
      longitude: Number.parseFloat(row.longitude),
      area: row.area,
      fill_level: Number.parseFloat(row.fill_level),
      capacity: Number.parseFloat(row.capacity),
      status: row.status,
      last_collected: row.last_collected,
      sensor_id: row.sensor_id,
      temperature: row.temperature ? Number.parseFloat(row.temperature) : null,
      gas_level: Number.parseFloat(row.gas_level),
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  }

  static async update(id, binData) {
    const fields = []
    const values = []
    let paramCount = 0

    for (const [key, value] of Object.entries(binData)) {
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
      UPDATE bins SET ${fields.join(", ")}
      WHERE id = $${++paramCount}
      RETURNING id, location_name, latitude, longitude, area, fill_level, capacity, 
                status, last_collected, sensor_id, temperature, gas_level, created_at, updated_at
    `

    const result = await pool.query(query, values)
    const row = result.rows[0]

    return {
      id: row.id,
      location_name: row.location_name,
      latitude: Number.parseFloat(row.latitude),
      longitude: Number.parseFloat(row.longitude),
      area: row.area,
      fill_level: Number.parseFloat(row.fill_level),
      capacity: Number.parseFloat(row.capacity),
      status: row.status,
      last_collected: row.last_collected,
      sensor_id: row.sensor_id,
      temperature: row.temperature ? Number.parseFloat(row.temperature) : null,
      gas_level: Number.parseFloat(row.gas_level),
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  }

  static async delete(id) {
    const query = "DELETE FROM bins WHERE id = $1 RETURNING id"
    const result = await pool.query(query, [id])
    return result.rows[0] || null
  }
}

module.exports = Bin
