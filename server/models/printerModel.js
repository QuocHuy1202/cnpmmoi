const connectDB = require("../config/sqlConfig");

async function getAllPrinters() {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM Printer");
    return result.recordset;
  } catch (err) {
    throw new Error("Error fetching printers: " + err.message);
  }
}


const createPrintRequest = async (payload) => {
  const { email, fileName, printer, printSettings, status } = payload;
  const pool = await connectDB();

  await pool.request()
    .input("email",  email)
    .input("fileName",  fileName)
    .input("printer",  printer)
    .input("printSettings",  printSettings)
    .input("status",  status)
    .query(`
      INSERT INTO print_requests (email, file_name, printer, print_settings, status)
      VALUES (@email, @fileName, @printer, @printSettings, @status)
    `);

  return { success: true };
};

const getPrintHistoryByEmail = async (email) => {
  const pool = await connectDB();

  const result = await pool.request()
    .input("email", email)
    .query(`
      SELECT id, file_name, printer, print_settings, status, created_at
      FROM print_requests
      WHERE email = @email
      ORDER BY created_at DESC
    `);

  return result.recordset;
};

module.exports = {
  getAllPrinters,
  createPrintRequest,
  getPrintHistoryByEmail,
};


