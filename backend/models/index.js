const pool = require("../config/database")
const User = require("./User")
const Vehicle = require("./Vehicle")
const VehicleLocation = require("./VehicleLocation")
const Bin = require("./Bin")
const CollectionLog = require("./CollectionLog")
const Alert = require("./Alert")

// Export the pool and all models
module.exports = {
  pool,
  User,
  Vehicle,
  VehicleLocation,
  Bin,
  CollectionLog,
  Alert,
}
