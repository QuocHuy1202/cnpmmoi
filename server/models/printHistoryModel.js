const connectDB = require("../config/sqlConfig"); // Import kết nối database

// Lấy danh sách lịch sử in
const getPrintHistory = async () => {
  const query = `
    SELECT 
      ph.print_ID,
      ph.file_name,
      ph.file_type,
      ph.number_of_pages,
      ph.paper_size,
      ph.is_doubled_side,
      ph.print_time,
      s.name AS student_name,
      s.email AS student_email,
      p.brand AS printer_brand,
      p.model AS printer_model,
      p.location AS printer_location
    FROM 
      PrintHistory ph
    INNER JOIN 
      Student s ON ph.student_ID = s.student_ID
    INNER JOIN 
      Printer p ON ph.printer_ID = p.printer_ID
    ORDER BY 
      ph.print_time DESC;
  `;

  try {
    const pool = await connectDB(); // Kết nối database
    const result = await pool.request().query(query); // Thực thi query
    return result.recordset; // Trả về danh sách kết quả
  } catch (err) {
    console.error("Lỗi khi truy vấn lịch sử in:", err);
    throw err;
  }
};

module.exports = { getPrintHistory };
