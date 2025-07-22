const pool = require("../config/database")
const bcrypt = require("bcryptjs")

async function seedDatabase() {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    console.log("Starting database seeding...")

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 12)
    const adminResult = await client.query(
      `
      INSERT INTO users (name, email, password, role, phone)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `,
      ["Admin User", "admin@rsgc.com", adminPassword, "admin", "+1234567890"],
    )

    // Create coordinator user
    const coordinatorPassword = await bcrypt.hash("coord123", 12)
    const coordinatorResult = await client.query(
      `
      INSERT INTO users (name, email, password, role, phone)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `,
      ["John Coordinator", "coordinator@rsgc.com", coordinatorPassword, "coordinator", "+1234567891"],
    )

    // Create driver users
    const driver1Password = await bcrypt.hash("driver123", 12)
    const driver1Result = await client.query(
      `
      INSERT INTO users (name, email, password, role, phone)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `,
      ["Mike Driver", "driver1@rsgc.com", driver1Password, "driver", "+1234567892"],
    )

    const driver2Password = await bcrypt.hash("driver123", 12)
    const driver2Result = await client.query(
      `
      INSERT INTO users (name, email, password, role, phone)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING
      RETURNING id
    `,
      ["Sarah Driver", "driver2@rsgc.com", driver2Password, "driver", "+1234567893"],
    )

    console.log("Users created successfully")

    // Get user IDs for vehicle assignment
    const driver1Id = driver1Result.rows[0]?.id
    const driver2Id = driver2Result.rows[0]?.id

    // Create vehicles
    await client.query(
      `
      INSERT INTO vehicles (number, capacity, status, driver_id, fuel_level, mileage)
      VALUES 
        ($1, $2, $3, $4, $5, $6),
        ($7, $8, $9, $10, $11, $12),
        ($13, $14, $15, $16, $17, $18)
      ON CONFLICT (number) DO NOTHING
    `,
      [
        "GC-001",
        1000.0,
        "active",
        driver1Id,
        85.5,
        15420.75,
        "GC-002",
        1200.0,
        "active",
        driver2Id,
        92.3,
        8750.25,
        "GC-003",
        800.0,
        "maintenance",
        null,
        45.0,
        22100.5,
      ],
    )

    console.log("Vehicles created successfully")

    // Create bins
    const binResults = await client.query(
      `
      INSERT INTO bins (location_name, latitude, longitude, area, fill_level, capacity, status, sensor_id, temperature, gas_level)
      VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10),
        ($11, $12, $13, $14, $15, $16, $17, $18, $19, $20),
        ($21, $22, $23, $24, $25, $26, $27, $28, $29, $30),
        ($31, $32, $33, $34, $35, $36, $37, $38, $39, $40),
        ($41, $42, $43, $44, $45, $46, $47, $48, $49, $50)
      ON CONFLICT (sensor_id) DO NOTHING
      RETURNING id
    `,
      [
        "Main Street Plaza",
        40.7128,
        -74.006,
        "Downtown",
        75.5,
        500.0,
        "active",
        "BIN-001",
        22.5,
        15.2,
        "Central Park North",
        40.7829,
        -73.9654,
        "Uptown",
        92.0,
        750.0,
        "full",
        "BIN-002",
        25.1,
        8.7,
        "Brooklyn Bridge Entrance",
        40.7061,
        -73.9969,
        "Brooklyn",
        45.3,
        600.0,
        "active",
        "BIN-003",
        21.8,
        12.4,
        "Times Square South",
        40.758,
        -73.9855,
        "Midtown",
        88.7,
        800.0,
        "active",
        "BIN-004",
        24.3,
        18.9,
        "Queens Plaza",
        40.7505,
        -73.937,
        "Queens",
        96.2,
        650.0,
        "overflow",
        "BIN-005",
        28.7,
        35.6,
      ],
    )

    console.log("Bins created successfully")

    // Create alerts for bins with high fill levels
    if (binResults.rows.length >= 2) {
      const bin2Id = binResults.rows[1]?.id // Central Park North
      const bin5Id = binResults.rows[4]?.id // Queens Plaza

      if (bin2Id && bin5Id) {
        await client.query(
          `
          INSERT INTO alerts (bin_id, type, severity, status, message, triggered_at)
          VALUES 
            ($1, $2, $3, $4, $5, $6),
            ($7, $8, $9, $10, $11, $12),
            ($13, $14, $15, $16, $17, $18)
        `,
          [
            bin2Id,
            "overflow",
            "high",
            "active",
            "Bin at Central Park North is 92% full and requires immediate attention",
            new Date(Date.now() - 2 * 60 * 60 * 1000),
            bin5Id,
            "overflow",
            "critical",
            "active",
            "Bin at Queens Plaza is overflowing (96.2% full)",
            new Date(Date.now() - 30 * 60 * 1000),
            bin5Id,
            "gas_leak",
            "medium",
            "active",
            "High gas level detected at Queens Plaza bin",
            new Date(Date.now() - 45 * 60 * 1000),
          ],
        )

        console.log("Alerts created successfully")
      }
    }

    await client.query("COMMIT")
    console.log("Database seeding completed successfully!")
    console.log("\nDefault login credentials:")
    console.log("Admin: admin@rsgc.com / admin123")
    console.log("Coordinator: coordinator@rsgc.com / coord123")
    console.log("Driver 1: driver1@rsgc.com / driver123")
    console.log("Driver 2: driver2@rsgc.com / driver123")
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error seeding database:", error)
    throw error
  } finally {
    client.release()
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

module.exports = seedDatabase
