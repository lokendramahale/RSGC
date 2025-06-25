const pool = require("../config/database")
const fs = require("fs")
const path = require("path")

async function initializeDatabase() {
  try {
    console.log("Initializing PostgreSQL database...")

    // Read schema file
    const schemaPath = path.join(__dirname, "..", "database", "schema.sql")
    const schema = fs.readFileSync(schemaPath, "utf8")

    // Execute schema
    await pool.query(schema)

    console.log("Database initialized successfully!")
    console.log("You can now run: npm run seed")
  } catch (error) {
    console.error("Database initialization failed:", error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

initializeDatabase()
