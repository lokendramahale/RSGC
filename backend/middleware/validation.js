const Joi = require("joi")

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: "Validation error",
        details: error.details.map((detail) => detail.message),
      })
    }
    next()
  }
}

const schemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  createUser: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "driver", "coordinator").required(),
    phone: Joi.string().pattern(/^[+]?[1-9][\d]{0,15}$/),
  }),

  updateUser: Joi.object({
    name: Joi.string().min(2).max(100),
    email: Joi.string().email(),
    role: Joi.string().valid("admin", "driver", "coordinator"),
    phone: Joi.string().pattern(/^[+]?[1-9][\d]{0,15}$/),
    status: Joi.string().valid("active", "inactive", "suspended"),
  }),

  createVehicle: Joi.object({
    number: Joi.string().required(),
    capacity: Joi.number().positive().required(),
    driver_id: Joi.string().uuid(),
    fuel_level: Joi.number().min(0).max(100),
  }),

  updateVehicle: Joi.object({
    number: Joi.string(),
    capacity: Joi.number().positive(),
    status: Joi.string().valid("active", "maintenance", "inactive"),
    driver_id: Joi.string().uuid().allow(null),
    fuel_level: Joi.number().min(0).max(100),
  }),

  createBin: Joi.object({
    location_name: Joi.string().required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    area: Joi.string().required(),
    capacity: Joi.number().positive().required(),
    sensor_id: Joi.string(),
  }),

  updateBin: Joi.object({
    location_name: Joi.string(),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    area: Joi.string(),
    fill_level: Joi.number().min(0).max(100),
    capacity: Joi.number().positive(),
    status: Joi.string().valid("active", "maintenance", "full", "overflow"),
    temperature: Joi.number(),
    gas_level: Joi.number().min(0),
  }),

  createCollection: Joi.object({
    bin_id: Joi.string().uuid().required(),
    vehicle_id: Joi.string().uuid().required(),
    fill_before: Joi.number().min(0).max(100).required(),
    fill_after: Joi.number().min(0).max(100).required(),
    weight_collected: Joi.number().positive(),
    notes: Joi.string(),
  }),

  vehicleLocation: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    speed: Joi.number().min(0),
    heading: Joi.number().min(0).max(360),
  }),
}

module.exports = {
  validateRequest,
  schemas,
}
