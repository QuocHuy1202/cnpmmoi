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

const addPrinterQuery = async (brand, model, location, status) => {
  const pool = await connectDB();
  //console.log("QUERY ADD PRINTER");
  const result = await pool.request()
    .input("brand", brand)
    .input("model", model)
    .input("location", location)
    .input("status", status)
    .query(`
      INSERT INTO Printer (brand, model, status, location)
      VALUES (@brand, @model, @status, @location)
    `);
  //console.log(result);
}

const deletePrinterQuery = async (delete_printers) => {
  const pool = await connectDB();
  //console.log("QUERY DELETE PRINTER");
  //console.log(delete_printers);
  try {
    for (const printerId of delete_printers) {
      // Delete query for each printer ID
      const result = await pool.request()
      .input("ID", printerId)
      .query(`
        DELETE FROM Printer
        WHERE printer_ID = @ID
      `);
      if (result.affectedRows === 0) {
        //console.log(`Printer with ID ${printerId} not found.`);
      }
    }
  } catch (error) {
    //console.error('Error deleting printers:', error);
  }
}

const updatePrinterStatusQuery = async (ID, status) => {
  //console.log(ID, status);
  const pool = await connectDB();
  //console.log("QUERY UPDATE PRINTER STATUS");
  const result = await pool.request()
    .input("ID", ID)
    .input("status", status)
    .query(`
      UPDATE Printer
      SET status = @status
      WHERE printer_ID = @ID;
    `);
  //console.log(result);
}

module.exports = {
  getAllPrinters,
  createPrintRequest,
  getPrintHistoryByEmail,
  addPrinterQuery,
  deletePrinterQuery,
  updatePrinterStatusQuery
};

