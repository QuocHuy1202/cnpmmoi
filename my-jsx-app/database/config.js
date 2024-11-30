const sql = require('mssql');

// Cấu hình kết nối SQL Server
const config = {
  user: 'sa',         // Tên đăng nhập SQL Server
  password: 'huy1202',     // Mật khẩu
  server: 'localhost',           // Tên máy chủ SQL Server
  database: 'KhoaHocOnline',     // Tên cơ sở dữ liệu
  options: {
    encrypt: true,               // Sử dụng mã hóa (Azure yêu cầu true)
    trustServerCertificate: true // Chỉ dùng nếu server là local hoặc self-signed
  }
};

// Hàm kết nối và thực thi truy vấn
async function main() {
  try {
    console.log('Đang kết nối đến SQL Server...');
    const pool = await sql.connect(config); // Kết nối

    console.log('Kết nối thành công!');

    // Thực thi một truy vấn
    const result = await pool.request().query('SELECT * FROM Employees');
    console.log('Kết quả truy vấn:', result.recordset);

  } catch (err) {
    console.error('Lỗi xảy ra:', err);
  }
}

// Gọi hàm chính
main();
