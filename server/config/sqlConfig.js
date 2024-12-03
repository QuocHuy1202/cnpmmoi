const sql = require("mssql");

const sqlConfig = {
  user: "sa",
  password: "Huy1022003",
  server: "localhost",
  database: "AccountDB",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const connectDB = async () => {
  try {
    return await sql.connect(sqlConfig);
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
};

module.exports = connectDB;
