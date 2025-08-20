# 🚛 RSGC

The **Remote Surveillance Garbage Collection (RSGC)** Backend API is built with **Node.js, Express.js, and PostgreSQL (with PostGIS)**.  
It powers the RSGC platform, enabling smart waste collection through real-time vehicle tracking, smart bin monitoring, and automated alerts.

🔗 **Live Application:** [https://rsgc.vercel.app](https://rsgc.vercel.app)

---

## ✨ Features

- 🔐 **Authentication & Roles** – Secure JWT-based login with role-based access (Admin, Coordinator, Driver).  
- 🚛 **Vehicle Management** – Register, assign, and track vehicles with GPS logs.  
- 🗑️ **Smart Bin Monitoring** – Manage bins with real-time sensor data (fill levels, temperature, gas).  
- 📊 **Analytics Dashboard** – Aggregated insights, charts, and metrics for administrators.  
- 🔔 **Alerts & Notifications** – Overflow, fire, and hazardous gas leak detection.  
- 📋 **Collection Logs** – Track collection history with photos and before/after fill levels.  
- 🗺️ **Geolocation** – Spatial queries and tracking powered by PostGIS.  
- 🛡️ **Security** – Helmet, CORS, rate limiting, and strong input validation.  

---

## 🛠️ Tech Stack

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** PostgreSQL + PostGIS  
- **ORM:** Sequelize  
- **Authentication:** JWT  
- **Uploads:** Multer  
- **Validation:** Joi  
- **Security:** Helmet, CORS, bcryptjs  

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)  
- PostgreSQL (v12+) with PostGIS extension  

### Installation
```bash
# Clone repository
git clone <repository-url>
cd rsgc-backend

# Install dependencies
npm install

# Setup database
createdb rsgc_db
# Enable PostGIS in psql
CREATE EXTENSION postgis;

# Start server
npm run dev   # development
npm start     # production
