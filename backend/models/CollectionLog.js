const pool = require("../config/database")

class CollectionLog {
  static async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, start_date, end_date, bin_id, vehicle_id } = { ...filters, ...pagination }
    const offset = (page - 1) * limit

    let whereClause = "WHERE 1=1"
    const params = []
    let paramCount = 0

    if (start_date) {
      whereClause += ` AND cl.collection_time >= $${++paramCount}`
      params.push(start_date)
    }

    if (end_date) {
      whereClause += ` AND cl.collection_time <= $${++paramCount}`
      params.push(end_date)
    }

    if (bin_id) {
      whereClause += ` AND cl.bin_id = $${++paramCount}`
      params.push(bin_id)
    }

    if (vehicle_id) {
      whereClause += ` AND cl.vehicle_id = $${++paramCount}`
      params.push(vehicle_id)
    }

    const countQuery = `SELECT COUNT(*) FROM collection_logs cl ${whereClause}`
    const dataQuery = `
      SELECT 
        cl.id, cl.bin_id, cl.vehicle_id, cl.collected_by, cl.fill_before, cl.fill_after,
        cl.weight_collected, cl.photo_url, cl.notes, cl.collection_time, cl.created_at, cl.updated_at,
        b.id as bin_bin_id, b.location_name as bin_location_name, b.area as bin_area,
        v.id as vehicle_vehicle_id, v.number as vehicle_number,
        u.id as collector_user_id, u.name as collector_name
      FROM collection_logs cl
      LEFT JOIN bins b ON cl.bin_id = b.id
      LEFT JOIN vehicles v ON cl.vehicle_id = v.id
      LEFT JOIN users u ON cl.collected_by = u.id
      ${whereClause}
      ORDER BY cl.collection_time DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `

    params.push(limit, offset)

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, params.slice(0, -2)),
      pool.query(dataQuery, params),
    ])

    const collections = dataResult.rows.map((row) => ({
      id: row.id,
      bin_id: row.bin_id,
      vehicle_id: row.vehicle_id,
      collected_by: row.collected_by,
      fill_before: Number.parseFloat(row.fill_before),
      fill_after: Number.parseFloat(row.fill_after),
      weight_collected: row.weight_collected ? Number.parseFloat(row.weight_collected) : null,
      photo_url: row.photo_url,
      notes: row.notes,
      collection_time: row.collection_time,
      created_at: row.created_at,
      updated_at: row.updated_at,
      bin: {
        id: row.bin_bin_id,
        location_name: row.bin_location_name,
        area: row.bin_area,
      },
      vehicle: {
        id: row.vehicle_vehicle_id,
        number: row.vehicle_number,
      },
      collector: {
        id: row.collector_user_id,
        name: row.collector_name,
      },
    }))

    return {
      collections,
      total: Number.parseInt(countResult.rows[0].count),
      page: Number.parseInt(page),
      pages: Math.ceil(Number.parseInt(countResult.rows[0].count) / limit),
      limit: Number.parseInt(limit),
    }
  }

  static async findByBinId(binId, limit = 10) {
    const query = `
      SELECT 
        cl.id, cl.bin_id, cl.vehicle_id, cl.collected_by, cl.fill_before, cl.fill_after,
        cl.weight_collected, cl.photo_url, cl.notes, cl.collection_time, cl.created_at, cl.updated_at,
        v.id as vehicle_vehicle_id, v.number as vehicle_number,
        u.id as collector_user_id, u.name as collector_name
      FROM collection_logs cl
      LEFT JOIN vehicles v ON cl.vehicle_id = v.id
      LEFT JOIN users u ON cl.collected_by = u.id
      WHERE cl.bin_id = $1
      ORDER BY cl.collection_time DESC
      LIMIT $2
    `

    const result = await pool.query(query, [binId, limit])

    return result.rows.map((row) => ({
      id: row.id,
      bin_id: row.bin_id,
      vehicle_id: row.vehicle_id,
      collected_by: row.collected_by,
      fill_before: Number.parseFloat(row.fill_before),
      fill_after: Number.parseFloat(row.fill_after),
      weight_collected: row.weight_collected ? Number.parseFloat(row.weight_collected) : null,
      photo_url: row.photo_url,
      notes: row.notes,
      collection_time: row.collection_time,
      created_at: row.created_at,
      updated_at: row.updated_at,
      vehicle: {
        id: row.vehicle_vehicle_id,
        number: row.vehicle_number,
      },
      collector: {
        id: row.collector_user_id,
        name: row.collector_name,
      },
    }))
  }

  static async findByVehicleId(vehicleId, limit = 10) {
    const query = `
      SELECT 
        cl.id, cl.bin_id, cl.vehicle_id, cl.collected_by, cl.fill_before, cl.fill_after,
        cl.weight_collected, cl.photo_url, cl.notes, cl.collection_time, cl.created_at, cl.updated_at,
        b.id as bin_bin_id, b.location_name as bin_location_name, b.area as bin_area,
        u.id as collector_user_id, u.name as collector_name
      FROM collection_logs cl
      LEFT JOIN bins b ON cl.bin_id = b.id
      LEFT JOIN users u ON cl.collected_by = u.id
      WHERE cl.vehicle_id = $1
      ORDER BY cl.collection_time DESC
      LIMIT $2
    `

    const result = await pool.query(query, [vehicleId, limit])

    return result.rows.map((row) => ({
      id: row.id,
      bin_id: row.bin_id,
      vehicle_id: row.vehicle_id,
      collected_by: row.collected_by,
      fill_before: Number.parseFloat(row.fill_before),
      fill_after: Number.parseFloat(row.fill_after),
      weight_collected: row.weight_collected ? Number.parseFloat(row.weight_collected) : null,
      photo_url: row.photo_url,
      notes: row.notes,
      collection_time: row.collection_time,
      created_at: row.created_at,
      updated_at: row.updated_at,
      bin: {
        id: row.bin_bin_id,
        location_name: row.bin_location_name,
        area: row.bin_area,
      },
      collector: {
        id: row.collector_user_id,
        name: row.collector_name,
      },
    }))
  }

  static async create(collectionData) {
    const { bin_id, vehicle_id, collected_by, fill_before, fill_after, weight_collected, photo_url, notes } =
      collectionData

    const query = `
      INSERT INTO collection_logs (bin_id, vehicle_id, collected_by, fill_before, fill_after, weight_collected, photo_url, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, bin_id, vehicle_id, collected_by, fill_before, fill_after, weight_collected, 
                photo_url, notes, collection_time, created_at, updated_at
    `

    const result = await pool.query(query, [
      bin_id,
      vehicle_id,
      collected_by,
      fill_before,
      fill_after,
      weight_collected || null,
      photo_url || null,
      notes || null,
    ])

    const row = result.rows[0]
    return {
      id: row.id,
      bin_id: row.bin_id,
      vehicle_id: row.vehicle_id,
      collected_by: row.collected_by,
      fill_before: Number.parseFloat(row.fill_before),
      fill_after: Number.parseFloat(row.fill_after),
      weight_collected: row.weight_collected ? Number.parseFloat(row.weight_collected) : null,
      photo_url: row.photo_url,
      notes: row.notes,
      collection_time: row.collection_time,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  }

  static async findById(id) {
    const query = `
      SELECT 
        cl.id, cl.bin_id, cl.vehicle_id, cl.collected_by, cl.fill_before, cl.fill_after,
        cl.weight_collected, cl.photo_url, cl.notes, cl.collection_time, cl.created_at, cl.updated_at,
        b.id as bin_bin_id, b.location_name as bin_location_name, b.area as bin_area,
        v.id as vehicle_vehicle_id, v.number as vehicle_number,
        u.id as collector_user_id, u.name as collector_name
      FROM collection_logs cl
      LEFT JOIN bins b ON cl.bin_id = b.id
      LEFT JOIN vehicles v ON cl.vehicle_id = v.id
      LEFT JOIN users u ON cl.collected_by = u.id
      WHERE cl.id = $1
    `

    const result = await pool.query(query, [id])

    if (result.rows.length === 0) return null

    const row = result.rows[0]
    return {
      id: row.id,
      bin_id: row.bin_id,
      vehicle_id: row.vehicle_id,
      collected_by: row.collected_by,
      fill_before: Number.parseFloat(row.fill_before),
      fill_after: Number.parseFloat(row.fill_after),
      weight_collected: row.weight_collected ? Number.parseFloat(row.weight_collected) : null,
      photo_url: row.photo_url,
      notes: row.notes,
      collection_time: row.collection_time,
      created_at: row.created_at,
      updated_at: row.updated_at,
      bin: {
        id: row.bin_bin_id,
        location_name: row.bin_location_name,
        area: row.bin_area,
      },
      vehicle: {
        id: row.vehicle_vehicle_id,
        number: row.vehicle_number,
      },
      collector: {
        id: row.collector_user_id,
        name: row.collector_name,
      },
    }
  }
}

module.exports = CollectionLog
