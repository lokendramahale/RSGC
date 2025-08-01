const jwt = require("jsonwebtoken")
const { User } = require("../models")

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "Access token required" })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const user = await User.findById(decoded.userId)
    
    console.log("Fetched User:", user);
    if (!user || user.status !== "active") {
      return res.status(401).json({ error: "Invalid or inactive user" })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" })
  }
}

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" })
    }

    next()
  }
}

const requireAdmin = requireRole(["admin"])
const requireAdminOrCoordinator = requireRole(["admin", "coordinator"])

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireAdminOrCoordinator,
}
