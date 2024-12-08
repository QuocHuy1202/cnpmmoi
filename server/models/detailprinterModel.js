const connectDB = require("../config/sqlConfig");

// Truy vấn lịch sử in của máy in (Full thông tin)
const getFullPrintHistoryByPrinterID = async () => {
  const query = `
    SELECT 
        file_name, 
        number_of_pages,
        file_type,
        print_time,
        printer_ID,
        student_ID
   

    FROM PrintHistory

  `;

  try {
    const pool = await connectDB();
    const result = await pool.request().query(query);

    return result.recordset || [];
  } catch (err) {
    console.error("Lỗi khi truy vấn lịch sử in:", err);
    throw new Error("Không thể truy vấn lịch sử in đầy đủ.");
  }
};

module.exports = { getFullPrintHistoryByPrinterID };
//' ', file_name,' ', number_of_pages, ' ',file_type,' ' ,print_time) AS name
// muốn thêm tên hs thì  + name ở SELECT
//LEFT JOIN Student
//ON PrintHistory.student_ID = Student.student_ID;