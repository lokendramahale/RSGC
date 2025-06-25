const { Pool } = require("pg")
require("dotenv").config()

//for supabase 
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false, // Supabase requires SSL
//   },
// });

// For local database
const pool = new Pool({
  user: process.env.DB_USER,        
  host: process.env.DB_HOST,        
  database: process.env.DB_NAME,   
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,        
});

// Test connection
pool.on("connect", () => {
  console.log("Connected to PostgreSQL database")
})

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err)
  process.exit(-1)
})

module.exports = pool
