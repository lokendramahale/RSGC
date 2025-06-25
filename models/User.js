const pool = require("../config/database")
const bcrypt = require("bcryptjs")

class User {
  static async findAll(filters = {}, pagination = {}) {
    const { page = 1, limit = 10, role, status } = { ...filters, ...pagination }
    const offset = (page - 1) * limit

    let whereClause = "WHERE 1=1"
    const params = []
    let paramCount = 0

    if (role) {
      whereClause += ` AND role = $${++paramCount}`
      params.push(role)
    }

    if (status) {
      whereClause += ` AND status = $${++paramCount}`
      params.push(status)
    }

    const countQuery = `SELECT COUNT(*) FROM users ${whereClause}`
    const dataQuery = `
      SELECT id, name, email, role, phone, status, last_login, created_at, updated_at
      FROM users ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `

    params.push(limit, offset)

    const [countResult, dataResult] = await Promise.all([
      pool.query(countQuery, params.slice(0, -2)),
      pool.query(dataQuery, params),
    ])

    return {
      users: dataResult.rows,
      total: Number.parseInt(countResult.rows[0].count),
      page: Number.parseInt(page),
      pages: Math.ceil(Number.parseInt(countResult.rows[0].count) / limit),
      limit: Number.parseInt(limit),
    }
  }

  static async findById(id) {
    const query = `
      SELECT id, name, email, role, phone, status, last_login, created_at, updated_at
      FROM users WHERE id = $1
    `
    const result = await pool.query(query, [id])
    return result.rows[0] || null
  }

  static async findByEmail(email) {
    const query = `
      SELECT id, name, email, password, role, phone, status, last_login, created_at, updated_at
      FROM users WHERE email = $1
    `
    const result = await pool.query(query, [email])
    return result.rows[0] || null
  }

  static async create(userData) {
    const { name, email, password, role = "driver", phone } = userData
    const hashedPassword = await bcrypt.hash(password, 12)

    const query = `
      INSERT INTO users (name, email, password, role, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, email, role, phone, status, created_at, updated_at
    `

    const result = await pool.query(query, [name, email, hashedPassword, role, phone])
    return result.rows[0]
  }

  static async update(id, userData) {
    const fields = []
    const values = []
    let paramCount = 0

    for (const [key, value] of Object.entries(userData)) {
      if (value !== undefined && key !== "id") {
        if (key === "password") {
          fields.push(`${key} = $${++paramCount}`)
          values.push(await bcrypt.hash(value, 12))
        } else {
          fields.push(`${key} = $${++paramCount}`)
          values.push(value)
        }
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update")
    }

    values.push(id)
    const query = `
      UPDATE users SET ${fields.join(", ")}
      WHERE id = $${++paramCount}
      RETURNING id, name, email, role, phone, status, last_login, created_at, updated_at
    `

    const result = await pool.query(query, values)
    return result.rows[0]
  }

  static async delete(id) {
    const query = "DELETE FROM users WHERE id = $1 RETURNING id"
    const result = await pool.query(query, [id])
    return result.rows[0] || null
  }

  static async updateLastLogin(id) {
    const query = `
      UPDATE users SET last_login = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, email, role, phone, status, last_login, created_at, updated_at
    `
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword)
  }
}

module.exports = User
