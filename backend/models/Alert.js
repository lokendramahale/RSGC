const pool = require("../config/database")

class Alert {
  static async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, status, type, severity } = { ...filters, ...pagination }
    const offset = (page - 1) * limit

    let whereClause = "WHERE 1=1"
    const params = []
    let paramCount = 0

    if (status) {
      whereClause += ` AND a.status = $${++paramCount}`
      params.push(status)
    }

    if (type) {
      whereClause += ` AND a.type = $${++paramCount}`
      params.push(type)
    }

    if (severity) {
      whereClause += ` AND a.severity = $${++paramCount}`
      params.push(severity)
    }

    const countQuery = `SELECT COUNT(*) FROM alerts a ${whereClause}`
    const dataQuery = `
      SELECT 
        a.id, a.bin_id, a.type, a.severity, a.status, a.message, a.triggered_at,
        a.acknowledged_at, a.resolved_at, a.resolved_by, a.created_at, a.updated_at,
        b.id as bin_bin_id, b.location_name as bin_location_name, b.area as bin_area,
        b.latitude as bin_latitude, b.longitude as bin_longitude
      FROM alerts a
      LEFT JOIN bins b ON a.bin_id = b.id
      ${whereClause}
      ORDER BY a.triggered_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `

    params.push(limit, offset)

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, params.slice(0, -2)),
      pool.query(dataQuery, params),
    ])

    const alerts = dataResult.rows.map((row) => ({
      id: row.id,
      bin_id: row.bin_id,
      type: row.type,
      severity: row.severity,
      status: row.status,
      message: row.message,
      triggered_at: row.triggered_at,
      acknowledged_at: row.acknowledged_at,
      resolved_at: row.resolved_at,
      resolved_by: row.resolved_by,
      created_at: row.created_at,
      updated_at: row.updated_at,
      bin: {
        id: row.bin_bin_id,
        location_name: row.bin_location_name,
        area: row.bin_area,
        latitude: row.bin_latitude ? Number.parseFloat(row.bin_latitude) : null,
        longitude: row.bin_longitude ? Number.parseFloat(row.bin_longitude) : null,
      },
    }))

    return {
      alerts,
      total: Number.parseInt(countResult.rows[0].count),
      page: Number.parseInt(page),
      pages: Math.ceil(Number.parseInt(countResult.rows[0].count) / limit),
      limit: Number.parseInt(limit),
    }
  }

  static async findActive() {
    const query = `
      SELECT 
        a.id, a.bin_id, a.type, a.severity, a.status, a.message, a.triggered_at,
        a.acknowledged_at, a.resolved_at, a.resolved_by, a.created_at, a.updated_at,
        b.id as bin_bin_id, b.location_name as bin_location_name, b.area as bin_area,
        b.latitude as bin_latitude, b.longitude as bin_longitude
      FROM alerts a
      LEFT JOIN bins b ON a.bin_id = b.id
      WHERE a.status = 'active'
      ORDER BY a.triggered_at DESC
    `

    const result = await pool.query(query)

    return result.rows.map((row) => ({
      id: row.id,
      bin_id: row.bin_id,
      type: row.type,
      severity: row.severity,
      status: row.status,
      message: row.message,
      triggered_at: row.triggered_at,
      acknowledged_at: row.acknowledged_at,
      resolved_at: row.resolved_at,
      resolved_by: row.resolved_by,
      created_at: row.created_at,
      updated_at: row.updated_at,
      bin: {
        id: row.bin_bin_id,
        location_name: row.bin_location_name,
        area: row.bin_area,
        latitude: row.bin_latitude ? Number.parseFloat(row.bin_latitude) : null,
        longitude: row.bin_longitude ? Number.parseFloat(row.bin_longitude) : null,
      },
    }))
  }

  static async findById(id) {
    const query = `
      SELECT 
        a.id, a.bin_id, a.type, a.severity, a.status, a.message, a.triggered_at,
        a.acknowledged_at, a.resolved_at, a.resolved_by, a.created_at, a.updated_at,
        b.id as bin_bin_id, b.location_name as bin_location_name, b.area as bin_area,
        b.latitude as bin_latitude, b.longitude as bin_longitude
      FROM alerts a
      LEFT JOIN bins b ON a.bin_id = b.id
      WHERE a.id = $1
    `

    const result = await pool.query(query, [id])

    if (result.rows.length === 0) return null

    const row = result.rows[0]
    return {
      id: row.id,
      bin_id: row.bin_id,
      type: row.type,
      severity: row.severity,
      status: row.status,
      message: row.message,
      triggered_at: row.triggered_at,
      acknowledged_at: row.acknowledged_at,
      resolved_at: row.resolved_at,
      resolved_by: row.resolved_by,
      created_at: row.created_at,
      updated_at: row.updated_at,
      bin: {
        id: row.bin_bin_id,
        location_name: row.bin_location_name,
        area: row.bin_area,
        latitude: row.bin_latitude ? Number.parseFloat(row.bin_latitude) : null,
        longitude: row.bin_longitude ? Number.parseFloat(row.bin_longitude) : null,
      },
    }
  }

  static async create(alertData) {
    const { bin_id, type, severity = "medium", message } = alertData

    const query = `
      INSERT INTO alerts (bin_id, type, severity, message)
      VALUES ($1, $2, $3, $4)
      RETURNING id, bin_id, type, severity, status, message, triggered_at, 
                acknowledged_at, resolved_at, resolved_by, created_at, updated_at
    `

    const result = await pool.query(query, [bin_id, type, severity, message])
    return result.rows[0]
  }

  static async update(id, alertData) {
    const fields = []
    const values = []
    let paramCount = 0

    for (const [key, value] of Object.entries(alertData)) {
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
      UPDATE alerts SET ${fields.join(", ")}
      WHERE id = $${++paramCount}
      RETURNING id, bin_id, type, severity, status, message, triggered_at, 
                acknowledged_at, resolved_at, resolved_by, created_at, updated_at
    `

    const result = await pool.query(query, values)
    return result.rows[0]
  }

  static async acknowledge(id) {
    const query = `
      UPDATE alerts SET status = 'acknowledged', acknowledged_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND status = 'active'
      RETURNING id, bin_id, type, severity, status, message, triggered_at, 
                acknowledged_at, resolved_at, resolved_by, created_at, updated_at
    `

    const result = await pool.query(query, [id])
    return result.rows[0] || null
  }

  static async resolve(id, resolvedBy, notes = null) {
    const query = `
      UPDATE alerts SET 
        status = 'resolved', 
        resolved_at = CURRENT_TIMESTAMP, 
        resolved_by = $2,
        message = CASE 
          WHEN $3 IS NOT NULL THEN message || E'\nResolution notes: ' || $3
          ELSE message
        END
      WHERE id = $1 AND status != 'resolved'
      RETURNING id, bin_id, type, severity, status, message, triggered_at, 
                acknowledged_at, resolved_at, resolved_by, created_at, updated_at
    `

    const result = await pool.query(query, [id, resolvedBy, notes])
    return result.rows[0] || null
  }

  static async resolveByBinAndType(binId, type, resolvedBy) {
    const query = `
      UPDATE alerts SET 
        status = 'resolved', 
        resolved_at = CURRENT_TIMESTAMP, 
        resolved_by = $3
      WHERE bin_id = $1 AND type = $2 AND status = 'active'
      RETURNING id
    `

    const result = await pool.query(query, [binId, type, resolvedBy])
    return result.rows
  }
}

module.exports = Alert
