const connectDB = require("../config/sqlConfig");

const getAccountByEmail = async (email) => {
  const pool = await connectDB();
  const result = await pool.request().input("email", email).query("SELECT * FROM account WHERE email = @email");
  return result.recordset[0];
};

const updateRemainingPages = async (email, number_of_pages_remaining) => {
  const pool = await connectDB();
  const result = await pool.request()
    .input("email", email)
    .input("number_of_pages_remaining", number_of_pages_remaining)
    .query("UPDATE account SET number_of_pages_remaining = @number_of_pages_remaining WHERE email = @email");
  return result.rowsAffected[0];
};

module.exports = { getAccountByEmail, updateRemainingPages };
