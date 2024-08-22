const { Client, Pool } = require("pg");
require('dotenv').config();

// Create a new pool instance using the connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Export the pool for use in other parts of the application
export default pool;
