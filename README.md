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

## 📡 API Endpoints (Highlights)

### Authentication
- `POST /api/auth/login` – User login  
- `GET /api/auth/profile` – Get logged-in user  
- `POST /api/auth/refresh` – Refresh token  

### Vehicles
- `GET /api/vehicles` – List vehicles  
- `POST /api/vehicles` – Create vehicle  
- `POST /api/vehicles/:id/location` – Log GPS data  
- `GET /api/vehicles/:id/locations` – Vehicle history  

### Bins
- `GET /api/bins` – List bins  
- `PATCH /api/bins/:id` – Update bin (triggers alerts if needed)  
- `GET /api/bins/alerts` – Get bins with active alerts  

### Collection Logs
- `POST /api/collections` – Add log (with photo)  
- `GET /api/collections/vehicle/:id` – Vehicle-specific logs  

### Dashboard
- `GET /api/dashboard/summary` – Metrics summary  
- `GET /api/dashboard/charts` – Chart data  

### Alerts
- `GET /api/alerts` – List alerts  
- `PATCH /api/alerts/:id/acknowledge` – Mark as acknowledged  
- `PATCH /api/alerts/:id/resolve` – Resolve alert  

---

## 🗄️ Database Overview
- **Users** – Authentication and roles (Admin, Coordinator, Driver)  
- **Vehicles** – Registry with driver assignments  
- **Vehicle Locations** – Timestamped GPS data (lat, lng, speed, heading)  
- **Bins** – Sensor data (fill level, temp, gas)  
- **Collection Logs** – History of waste collection with photos  
- **Alerts** – Overflow, fire, gas leak alerts with resolution tracking  

---

## 🔒 Security
- **JWT Authentication** – Token-based secure sessions  
- **RBAC** – Role-based access control  
- **Password Hashing** – bcrypt for secure storage  
- **Rate Limiting** – Prevent brute-force & spam requests  
- **Helmet + CORS** – Secured headers & API protection  
- **Input Validation** – Joi schema-based validation  

---

## ⚙️ Production Considerations
- Managed **PostgreSQL with PostGIS**  
- Use **HTTPS** for secure transport  
- Cloud storage for file uploads (e.g., AWS S3)  
- Logging & monitoring enabled  
- Regular **database backups**  

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
