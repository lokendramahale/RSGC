const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'rsgc_db',
  password: '123@Lucky',
  port: 5432,
});

client.connect()
  .then(() => console.log("Connected to DB"))
  .catch(err => console.error("Connection error", err.stack));
