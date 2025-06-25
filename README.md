# RSGC Backend API

Remote Surveillance Garbage Collection (RSGC) Backend API built with Node.js, Express.js, and PostgreSQL.

## Features

- 🔐 JWT-based authentication with role-based access control
- 🚛 Vehicle management and real-time tracking
- 🗑️ Smart bin monitoring with sensor data
- 📊 Analytics dashboard with comprehensive metrics
- 🔔 Real-time alerts and notifications
- 📋 Collection logs with photo uploads
- 🗺️ Geolocation support with PostGIS
- 🛡️ Security middleware (Helmet, CORS, Rate limiting)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with PostGIS
- **ORM**: Sequelize
- **Authentication**: JWT
- **File Upload**: Multer
- **Validation**: Joi
- **Security**: Helmet, CORS, bcryptjs

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher) with PostGIS extension
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd rsgc-backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment setup**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your database credentials and configuration
   \`\`\`

4. **Database setup**
   \`\`\`bash
   # Create PostgreSQL database
   createdb rsgc_db
   
   # Enable PostGIS extension (run in psql)
   CREATE EXTENSION postgis;
   \`\`\`

5. **Start the server**
   \`\`\`bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   \`\`\`

6. **Seed the database (optional)**
   \`\`\`bash
   npm run seed
   \`\`\`

## API Documentation

### Authentication

All protected routes require a Bearer token in the Authorization header:
\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

### Default Credentials

After seeding the database:
- **Admin**: admin@rsgc.com / admin123
- **Coordinator**: coordinator@rsgc.com / coord123
- **Driver**: driver1@rsgc.com / driver123

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/refresh` - Refresh JWT token

#### User Management
- `GET /api/users` - List all users (admin only)
- `POST /api/users` - Create user (admin only)
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)
- `PATCH /api/users/:id/reset-password` - Reset password (admin only)

#### Vehicle Management
- `GET /api/vehicles` - List all vehicles
- `POST /api/vehicles` - Create vehicle (admin/coordinator)
- `PATCH /api/vehicles/:id` - Update vehicle (admin/coordinator)
- `DELETE /api/vehicles/:id` - Delete vehicle (admin/coordinator)
- `POST /api/vehicles/:id/assign-driver` - Assign driver (admin/coordinator)
- `GET /api/vehicles/active` - Get active vehicles with locations

#### Vehicle Tracking
- `POST /api/vehicles/:id/location` - Log vehicle GPS location
- `GET /api/vehicles/:id/locations` - Get vehicle route history

#### Bin Management
- `GET /api/bins` - List all bins
- `POST /api/bins` - Create bin (admin/coordinator)
- `PATCH /api/bins/:id` - Update bin (triggers alerts if needed)
- `DELETE /api/bins/:id` - Delete bin (admin/coordinator)
- `GET /api/bins/alerts` - Get bins with active alerts
- `GET /api/bins/nearby` - Find nearby bins

#### Collection Logs
- `GET /api/collections` - List all collection logs
- `POST /api/collections` - Create collection log (with photo upload)
- `GET /api/collections/bin/:id` - Get collections by bin
- `GET /api/collections/vehicle/:id` - Get collections by vehicle

#### Dashboard Analytics
- `GET /api/dashboard/summary` - Get dashboard metrics
- `GET /api/dashboard/charts` - Get chart data
- `GET /api/dashboard/activities` - Get recent activities

#### Alerts & Notifications
- `GET /api/alerts` - List all alerts
- `GET /api/alerts/active` - Get active alerts
- `PATCH /api/alerts/:id/acknowledge` - Acknowledge alert
- `PATCH /api/alerts/:id/resolve` - Resolve alert (admin/coordinator)

## Database Schema

### Users
- Authentication and role management
- Roles: admin, coordinator, driver

### Vehicles
- Vehicle information and status
- Driver assignments

### Vehicle Locations
- GPS tracking data with timestamps
- Speed and heading information

### Bins
- Smart bin locations and sensor data
- Fill levels, temperature, gas detection

### Collection Logs
- Collection history with photos
- Before/after fill levels

### Alerts
- Automated alerts for overflow, fire, gas leaks
- Status tracking and resolution

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for admin, coordinator, driver
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Configurable cross-origin requests
- **Helmet Security**: Security headers and protection
- **Input Validation**: Joi schema validation
- **File Upload Security**: Secure image upload with type validation

## Development

### Running Tests
\`\`\`bash
npm test
\`\`\`

### Code Structure
\`\`\`
├── config/          # Database configuration
├── middleware/      # Authentication, validation, upload
├── models/          # Sequelize models
├── routes/          # API route handlers
├── seeders/         # Database seeders
├── uploads/         # File upload directory
└── server.js        # Main application file
\`\`\`

### Environment Variables

\`\`\`env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rsgc_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
\`\`\`

## Deployment

### Using Docker

\`\`\`dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
\`\`\`

### Production Considerations

1. **Environment Variables**: Use secure environment variable management
2. **Database**: Use managed PostgreSQL service with PostGIS
3. **File Storage**: Consider cloud storage for uploads (AWS S3, etc.)
4. **Monitoring**: Implement logging and monitoring solutions
5. **SSL**: Use HTTPS in production
6. **Backup**: Regular database backups

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
