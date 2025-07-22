const { sequelize, User, Vehicle, Bin, Alert } = require("../models")
const bcrypt = require("bcryptjs")

async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Create admin user
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@rsgc.com",
      password: "admin123",
      role: "admin",
      phone: "+1234567890",
    })

    // Create coordinator user
    const coordinatorUser = await User.create({
      name: "John Coordinator",
      email: "coordinator@rsgc.com",
      password: "coord123",
      role: "coordinator",
      phone: "+1234567891",
    })

    // Create driver users
    const driver1 = await User.create({
      name: "Mike Driver",
      email: "driver1@rsgc.com",
      password: "driver123",
      role: "driver",
      phone: "+1234567892",
    })

    const driver2 = await User.create({
      name: "Sarah Driver",
      email: "driver2@rsgc.com",
      password: "driver123",
      role: "driver",
      phone: "+1234567893",
    })

    console.log("Users created successfully")

    // Create vehicles
    const vehicle1 = await Vehicle.create({
      number: "GC-001",
      capacity: 1000.0,
      status: "active",
      driver_id: driver1.id,
      fuel_level: 85.5,
      mileage: 15420.75,
    })

    const vehicle2 = await Vehicle.create({
      number: "GC-002",
      capacity: 1200.0,
      status: "active",
      driver_id: driver2.id,
      fuel_level: 92.3,
      mileage: 8750.25,
    })

    const vehicle3 = await Vehicle.create({
      number: "GC-003",
      capacity: 800.0,
      status: "maintenance",
      fuel_level: 45.0,
      mileage: 22100.5,
    })

    console.log("Vehicles created successfully")

    // Create bins in different areas
    const bins = [
      {
        location_name: "Main Street Plaza",
        latitude: 40.7128,
        longitude: -74.006,
        area: "Downtown",
        fill_level: 75.5,
        capacity: 500.0,
        status: "active",
        sensor_id: "BIN-001",
        temperature: 22.5,
        gas_level: 15.2,
      },
      {
        location_name: "Central Park North",
        latitude: 40.7829,
        longitude: -73.9654,
        area: "Uptown",
        fill_level: 92.0,
        capacity: 750.0,
        status: "full",
        sensor_id: "BIN-002",
        temperature: 25.1,
        gas_level: 8.7,
      },
      {
        location_name: "Brooklyn Bridge Entrance",
        latitude: 40.7061,
        longitude: -73.9969,
        area: "Brooklyn",
        fill_level: 45.3,
        capacity: 600.0,
        status: "active",
        sensor_id: "BIN-003",
        temperature: 21.8,
        gas_level: 12.4,
      },
      {
        location_name: "Times Square South",
        latitude: 40.758,
        longitude: -73.9855,
        area: "Midtown",
        fill_level: 88.7,
        capacity: 800.0,
        status: "active",
        sensor_id: "BIN-004",
        temperature: 24.3,
        gas_level: 18.9,
      },
      {
        location_name: "Queens Plaza",
        latitude: 40.7505,
        longitude: -73.937,
        area: "Queens",
        fill_level: 96.2,
        capacity: 650.0,
        status: "overflow",
        sensor_id: "BIN-005",
        temperature: 28.7,
        gas_level: 35.6,
      },
    ]

    const createdBins = await Bin.bulkCreate(bins)
    console.log("Bins created successfully")

    // Create alerts for bins with high fill levels
    const alerts = [
      {
        bin_id: createdBins[1].id, // Central Park North (92% full)
        type: "overflow",
        severity: "high",
        status: "active",
        message: "Bin at Central Park North is 92% full and requires immediate attention",
        triggered_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        bin_id: createdBins[4].id, // Queens Plaza (96.2% full)
        type: "overflow",
        severity: "critical",
        status: "active",
        message: "Bin at Queens Plaza is overflowing (96.2% full)",
        triggered_at: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
      {
        bin_id: createdBins[4].id, // Queens Plaza (high gas level)
        type: "gas_leak",
        severity: "medium",
        status: "active",
        message: "High gas level detected at Queens Plaza bin",
        triggered_at: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      },
    ]

    await Alert.bulkCreate(alerts)
    console.log("Alerts created successfully")

    console.log("Database seeding completed successfully!")
    console.log("\nDefault login credentials:")
    console.log("Admin: admin@rsgc.com / admin123")
    console.log("Coordinator: coordinator@rsgc.com / coord123")
    console.log("Driver 1: driver1@rsgc.com / driver123")
    console.log("Driver 2: driver2@rsgc.com / driver123")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await sequelize.close()
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase()
}

module.exports = seedDatabase
