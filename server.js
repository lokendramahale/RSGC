const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const morgan = require("morgan")
const fs = require("fs")
const path = require("path")
require("dotenv").config()

const pool = require("./config/database")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const vehicleRoutes = require("./routes/vehicles")
const binRoutes = require("./routes/bins")
const collectionRoutes = require("./routes/collections")
const dashboardRoutes = require("./routes/dashboard")
const alertRoutes = require("./routes/alerts")

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use("/api/", limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Logging
app.use(morgan("combined"))

// Static files for uploads
app.use("/uploads", express.static("uploads"))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/vehicles", vehicleRoutes)
app.use("/api/bins", binRoutes)
app.use("/api/collections", collectionRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/alerts", alertRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

// Database initialization and server start
async function initializeDatabase() {
  try {
    console.log("Initializing database...")

    // Read and execute schema
    const schemaPath = path.join(__dirname, "database", "schema.sql")
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, "utf8")
      await pool.query(schema)
      console.log("Database schema initialized successfully.")
    }
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error
  }
}

async function startServer() {
  try {
    // Test database connection
    await pool.query("SELECT NOW()")
    console.log("Database connection established successfully.")

    // Initialize database schema
    // await initializeDatabase()

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
    })
  } catch (error) {
    console.error("Unable to start server:", error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...")
  await pool.end()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  console.log("Shutting down gracefully...")
  await pool.end()
  process.exit(0)
})

startServer()
