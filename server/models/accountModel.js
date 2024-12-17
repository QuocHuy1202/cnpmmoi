const connectDB = require("../config/sqlConfig");

const getAccountByEmail = async (email) => {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input("email", email)
    .query(`
      SELECT * FROM GetAccountInfo(@email)
  `);
  return result.recordset[0];
};

const updateRemainingPages = async (email, number_of_pages_remaining) => {
  const pool = await connectDB();
  const result = await pool.request()
    .input("email", email)
    .input("number_of_pages_remaining", number_of_pages_remaining)
    .query("UPDATE Student SET number_of_pages_remaining = @number_of_pages_remaining WHERE email = @email");
  return result.rowsAffected[0];
};
const getAllStudents = async () => {
  const pool = await connectDB();
  const result = await pool.request().query("SELECT MSSV FROM Student");
  return result.recordset;
};
module.exports = { getAccountByEmail, updateRemainingPages, getAllStudents};
