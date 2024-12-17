const connectDB = require("../config/sqlConfig"); // Import kết nối database

// Lấy danh sách lịch sử in


const getPrintHistorySPSO = async (printerId, mssv) => {
  const query = `
    SELECT 
      pr.id AS print_request_id,
      st.MSSV AS student_id,
      st.number_of_pages_remaining AS remaining_pages,
      a.email AS account_email,
      a.account_type AS account_role,
      pr.file_name AS printed_file,
      pr.printer AS printer_name,
      pr.print_settings AS settings,
      pr.status AS print_status,
      pr.created_at AS printed_time
    FROM 
      print_requests pr
    LEFT JOIN 
      account a ON pr.email = a.email
    LEFT JOIN 
      student st ON a.email = st.email
    WHERE 
      (@printerId IS NULL OR pr.printer = @printerId) AND
      (@mssv IS NULL OR st.MSSV = @mssv)
  `;
  
  const pool = await connectDB();
  const result = await pool.request()
    .input("printerId", printerId || null)
    .input("mssv",  mssv || null)
    .query(query);

  return result.recordset;
};



module.exports = {    getPrintHistorySPSO };


