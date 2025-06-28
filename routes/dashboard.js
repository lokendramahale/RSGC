const express = require("express")
const pool = require("../config/database")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Get dashboard summary (authenticateToken has been removed temporarily for testing)
router.get("/summary",  async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const summaryQuery = `
      SELECT 
        (SELECT COUNT(*) FROM bins) as total_bins,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'active') as active_vehicles,
        (SELECT COUNT(*) FROM alerts WHERE triggered_at >= $1 AND status = 'active') as alerts_today,
        (SELECT COUNT(*) FROM collection_logs WHERE collection_time >= $1) as collections_today,
        (SELECT COUNT(*) FROM bins WHERE status = 'overflow') as overflow_bins,
        (SELECT COUNT(*) FROM users WHERE status = 'active') as total_users,
        (SELECT ROUND(AVG(fill_level), 2) FROM bins) as avg_fill_level,
        (SELECT 
    CASE 
        WHEN last = 0 THEN 
            CASE WHEN curr > 0 THEN 100.0 ELSE 0.0 END
        ELSE ROUND((curr - last) * 100.0 / last, 2)
    END AS change_in_bins
FROM (
    SELECT
        COUNT(*) FILTER (
            WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
        ) AS curr,
        COUNT(*) FILTER (
            WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        ) AS last
    FROM bins
) AS count
)
    `

    const result = await pool.query(summaryQuery, [today])
    const summary = result.rows[0]

    res.json({
      summary: {
        totalBins: Number.parseInt(summary.total_bins),
        activeVehicles: Number.parseInt(summary.active_vehicles),
        alertsToday: Number.parseInt(summary.alerts_today),
        collectionsToday: Number.parseInt(summary.collections_today),
        overflowBins: Number.parseInt(summary.overflow_bins),
        totalUsers: Number.parseInt(summary.total_users),
        avgFillLevel: Number.parseFloat(summary.avg_fill_level) || 0,
        changeInBins: Number.parseInt(summary.change_in_bins) ,
      },
    })
  } catch (error) {
    console.error("Get dashboard summary error:", error)
    res.status(500).json({ error: "Failed to get dashboard summary" })
  }
})

// Get chart data
router.get("/charts", authenticateToken, async (req, res) => {
  try {
    const { days = 7 } = req.query
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number.parseInt(days))

    // Daily collection trends
    const dailyCollectionsQuery = `
      SELECT 
        DATE(collection_time) as date,
        COUNT(*) as count
      FROM collection_logs
      WHERE collection_time >= $1
      GROUP BY DATE(collection_time)
      ORDER BY DATE(collection_time) ASC
    `

    // Area-wise bin distribution
    const areaStatsQuery = `
      SELECT 
        area,
        COUNT(*) as total_bins,
        ROUND(AVG(fill_level), 2) as avg_fill_level
      FROM bins
      GROUP BY area
      ORDER BY area ASC
    `

    // Vehicle usage (collections per vehicle)
    const vehicleUsageQuery = `
      SELECT 
        v.number,
        COUNT(cl.id) as collections
      FROM vehicles v
      LEFT JOIN collection_logs cl ON v.id = cl.vehicle_id AND cl.collection_time >= $1
      GROUP BY v.id, v.number
      ORDER BY COUNT(cl.id) DESC
    `

    // Alert trends
    const alertTrendsQuery = `
      SELECT 
        type,
        COUNT(*) as count
      FROM alerts
      WHERE triggered_at >= $1
      GROUP BY type
    `

    const [dailyCollections, areaStats, vehicleUsage, alertTrends] = await Promise.all([
      pool.query(dailyCollectionsQuery, [startDate]),
      pool.query(areaStatsQuery),
      pool.query(vehicleUsageQuery, [startDate]),
      pool.query(alertTrendsQuery, [startDate]),
    ])

    res.json({
      charts: {
        dailyCollections: dailyCollections.rows.map((row) => ({
          date: row.date,
          count: Number.parseInt(row.count),
        })),
        areaStats: areaStats.rows.map((row) => ({
          area: row.area,
          total_bins: Number.parseInt(row.total_bins),
          avg_fill_level: Number.parseFloat(row.avg_fill_level),
        })),
        vehicleUsage: vehicleUsage.rows.map((row) => ({
          vehicle: { number: row.number },
          collections: Number.parseInt(row.collections),
        })),
        alertTrends: alertTrends.rows.map((row) => ({
          type: row.type,
          count: Number.parseInt(row.count),
        })),
      },
    })
  } catch (error) {
    console.error("Get chart data error:", error)
    res.status(500).json({ error: "Failed to get chart data" })
  }
})

// Get recent activities (authenticateToken has been removed temporarily for testing)
router.get("/activities", async (req, res) => {
  try {
    const { limit = 10 } = req.query

    const recentCollectionsQuery = `
      SELECT 
        cl.id, cl.collection_time,
        b.location_name as bin_location_name,
        u.name as collector_name
      FROM collection_logs cl
      LEFT JOIN bins b ON cl.bin_id = b.id
      LEFT JOIN users u ON cl.collected_by = u.id
      ORDER BY cl.collection_time DESC
      LIMIT $1
    `

    const recentAlertsQuery = `
      SELECT 
        a.id, a.type, a.severity, a.message, a.triggered_at,
        b.location_name as bin_location_name
      FROM alerts a
      LEFT JOIN bins b ON a.bin_id = b.id
      ORDER BY a.triggered_at DESC
      LIMIT $1
    `

    const [recentCollections, recentAlerts] = await Promise.all([
      pool.query(recentCollectionsQuery, [limit]),
      pool.query(recentAlertsQuery, [limit]),
    ])

    res.json({
      activities: {
        recentCollections: recentCollections.rows.map((row) => ({
          id: row.id,
          collection_time: row.collection_time,
          bin: { location_name: row.bin_location_name },
          collector: { name: row.collector_name },
        })),
        recentAlerts: recentAlerts.rows.map((row) => ({
          id: row.id,
          type: row.type,
          severity: row.severity,
          message: row.message,
          triggered_at: row.triggered_at,
          bin: { location_name: row.bin_location_name },
        })),
      },
    })
  } catch (error) {
    console.error("Get activities error:", error)
    res.status(500).json({ error: "Failed to get activities" })
  }
})

module.exports = router
