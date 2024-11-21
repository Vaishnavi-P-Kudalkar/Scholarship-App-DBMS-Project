const mysql = require('mysql2');  // Or 'mysql' depending on the package you use

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',      // Replace with your actual database host
  user: 'root',  // Replace with your actual database username
  password: 'Root', // Replace with your actual database password
  database: 'scholarshipdb'   // Replace with your actual database name
});

// Export the pool to use in other parts of your app
module.exports = pool;
