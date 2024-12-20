const sql = require("mssql");
require("dotenv").config(); // Load environment variables

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT),
  options: {
    trustServerCertificate: true, //Allow self-signed certificates
  },
  pool: {
    max: 10, // Max number of connections
    min: 0, // Min number of connections
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("Database Connection Failed!", err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise,
};
