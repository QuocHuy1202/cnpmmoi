const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const sql = require("mssql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const app = express();
const port = 5001;

app.use(bodyParser.json()); // Parse JSON request body
app.use(cors());

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: "dzaaf6exo", // Thay thế bằng cloud name của bạn
  api_key: "661285873379126", // Thay thế bằng API key của bạn
  api_secret: "Kem3yi85yd25XLOkJ8Zgs-SNJsA", // Thay thế bằng API secret của bạn
});

const sqlConfig = {
  user: "sa",
  password: "huy1202",
  server: "localhost",
  database: "AccountDB",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Configure Multer for file uploads (Lưu trữ trong bộ nhớ)
const storage = multer.memoryStorage(); // Lưu trữ tạm thời trong bộ nhớ (không lưu vào ổ đĩa)
const upload = multer({ storage });

// User login endpoint
app.post("/api/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await sql.connect(sqlConfig);
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM account WHERE email = @email");

    const user = result.recordset[0];
    if (!user) {
      return res.status(400).json({ message: "Email or password is incorrect" });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: "Email or password is incorrect" });
    }

    const token = jwt.sign({ email: user.email }, "jwt_secret_key", { expiresIn: "6h" });

    res.status(200).json({
      token,
      status: user.status,                    // Trả về trạng thái tài khoản
      number_of_pages_remaining: user.number_of_pages_remaining  // Trả về số trang còn lại
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error during authentication" });
  }
});

// File upload endpoint
// File upload endpoint
// File upload endpoint with token authentication



app.get("/api/files", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header Authorization

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token, "jwt_secret_key");
    const email = decoded.email;

    const pool = await sql.connect(sqlConfig);

    // Lấy danh sách file theo email
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM files WHERE email = @email");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No files found for this email." });
    }

    // Trả danh sách file
    res.status(200).json({ files: result.recordset });
  } catch (err) {
    console.error("Error:", err);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    res.status(500).json({ message: "Error fetching files." });
  }
});
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header Authorization

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "jwt_secret_key"); // Giải mã token
    req.user = decoded; // Lưu thông tin người dùng vào request
    next(); // Tiến hành với middleware tiếp theo
  } catch (err) {
    console.error("Token error:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
app.post("/api/upload", verifyToken, upload.single("file"), async (req, res) => {
  const { email } = req.user;  // Extract email from the token (verified)
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "File is required." });
  }

  try {
    // Upload file to Cloudinary using cloudinary.uploader.upload
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",  // Automatically detect file type (image, video, PDF, etc.)
        access_mode: "public",  // Make the file publicly accessible
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Error uploading file to Cloudinary", error });
        }

        const filePath = result.secure_url; // Cloudinary returns the secure URL of the uploaded file

        // Save file info to database
        try {
          const pool = await sql.connect(sqlConfig);
          await pool.request()
            .input("email", sql.VarChar, email)
            .input("fileName", sql.VarChar, file.originalname)
            .input("filePath", sql.VarChar, filePath)
            .input("fileType", sql.VarChar, path.extname(file.originalname).substring(1))
            .query(`
              INSERT INTO files (email, file_name, file_path, file_type)
              VALUES (@email, @fileName, @filePath, @fileType)
            `);

          // Send success response with file URL
          res.status(200).json({ message: "File uploaded successfully to Cloudinary.", filePath });
        } catch (err) {
          console.error("Error saving file info to database:", err);
          res.status(500).json({ message: "Error saving file info to database." });
        }
      }
    ).end(file.buffer); // Pass file buffer to .upload_stream to upload it to Cloudinary
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error uploading file." });
  }
});
// Endpoint xử lý in
app.post("/print", verifyToken, async (req, res) => {
  const { fileDetails, printSettings, printer } = req.body;
  const { email } = req.user;  // Lấy thông tin email từ token

  // Kiểm tra xem dữ liệu có đầy đủ không
  if (!fileDetails || !fileDetails.name || !printer || !printSettings) {
    return res.status(400).json({ message: "Thông tin in không đầy đủ. Vui lòng kiểm tra lại." });
  }

  // Tạo dữ liệu yêu cầu in
  const requestPayload = {
    email,
    fileName: fileDetails.name,
    printer,
    printSettings: JSON.stringify(printSettings),  // Lưu cài đặt in dưới dạng chuỗi JSON
    status: "Completed",
  };

  try {
    // Kết nối với cơ sở dữ liệu
    const pool = await sql.connect(sqlConfig);

    // Lưu thông tin yêu cầu in vào cơ sở dữ liệu
    const result = await pool.request()
      .input("email", sql.VarChar, requestPayload.email)
      .input("fileName", sql.VarChar, requestPayload.fileName)
      .input("printer", sql.VarChar, requestPayload.printer)
      .input("printSettings", sql.NVarChar, requestPayload.printSettings)
      .input("status", sql.VarChar, requestPayload.status)
      .query(`
        INSERT INTO print_requests (email, file_name, printer, print_settings, status)
        VALUES (@email, @fileName, @printer, @printSettings, @status)
      `);

    // Giả lập quá trình in
    console.log("Đang xử lý in...");
    console.log("In file:", fileDetails.name);
    console.log("Máy in:", printer);
    console.log("Cài đặt in:", printSettings);

    // Trả về thông báo thành công
    res.status(200).json({ message: "In thành công!" });
    
    // Nếu bạn muốn thực hiện thêm các công việc khác sau khi in, bạn có thể xử lý ở đây

  } catch (err) {
    console.error("Lỗi khi xử lý yêu cầu in:", err);
    res.status(500).json({ message: "Lỗi trong quá trình in. Vui lòng thử lại." });
  }
});
app.get("/history", verifyToken, async (req, res) => {
  const { email } = req.user;  // Lấy thông tin email từ token

  try {
    // Kết nối với cơ sở dữ liệu
    const pool = await sql.connect(sqlConfig);

    // Truy vấn lịch sử in của người dùng theo email
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .query(`
        SELECT id, file_name, printer, print_settings, status, created_at
        FROM print_requests
        WHERE email = @email
        ORDER BY created_at DESC
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy lịch sử in." });
    }

    // Trả về danh sách lịch sử in
    res.status(200).json({ history: result.recordset });
  } catch (err) {
    console.error("Lỗi khi lấy lịch sử in:", err);
    res.status(500).json({ message: "Lỗi khi lấy lịch sử in." });
  }
});
app.get("/printers", async (req, res) => {
  try {
    // Kết nối đến SQL Server
    const pool = await sql.connect(sqlConfig);

    // Query dữ liệu
    let result = await pool.request().query("SELECT * FROM Printer");
    
    // Trả về danh sách máy in
    res.json(result.recordset);

  } catch (err) {
    console.error("Error fetching printers:", err);
    res.status(500).send("Internal Server Error");
  }
});
// Endpoint cập nhật số trang còn lại
app.post("/api/account/update-pages", verifyToken, async (req, res) => {
  const { email } = req.user; // Lấy email từ token
  const { number_of_pages_remaining } = req.body; // Dữ liệu số trang còn lại từ client

  if (number_of_pages_remaining == null || isNaN(number_of_pages_remaining)) {
    return res.status(400).json({ message: "Invalid remainingPages value." });
  }

  try {
    // Kết nối tới cơ sở dữ liệu
    const pool = await sql.connect(sqlConfig);

    // Cập nhật số trang còn lại
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .input("number_of_pages_remaining", sql.Int, number_of_pages_remaining)
      .query(`
        UPDATE account
        SET number_of_pages_remaining = @number_of_pages_remaining
        WHERE email = @email
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Account not found." });
    }

    res.status(200).json({ message: "Updated remaining pages successfully." });
  } catch (err) {
    console.error("Error updating remaining pages:", err);
    res.status(500).json({ message: "Error updating remaining pages." });
  }
});
app.post("/api/payment", verifyToken, async (req, res) => {
  const { pagesToBuy, totalAmount, status } = req.body;
  const { email } = req.user; // Email từ token đã giải mã

  try {
    // Lưu thông tin thanh toán vào cơ sở dữ liệu
    const pool = await sql.connect(sqlConfig);
    await pool.request()
      .input("email", sql.VarChar, email)
      .input("pagesToBuy", sql.Int, pagesToBuy)
      .input("totalAmount", sql.Int, totalAmount)
      .input("status", sql.VarChar, status)
      .query(`
        INSERT INTO payments (email, pages_to_buy, total_amount, status)
        VALUES (@email, @pagesToBuy, @totalAmount, @status)
      `);

    // Trả về thông báo thanh toán thành công
    res.status(200).json({ message: "Yêu cầu thành công, vui lòng lên BKPay để thanh toán." });
  } catch (err) {
    console.error("Lỗi khi xử lý thanh toán:", err);
    res.status(500).json({ message: "Lỗi trong quá trình thanh toán. Vui lòng thử lại." });
  }
});
app.get("/payment-history", verifyToken, async (req, res) => {
  const { email } = req.user;  // Lấy thông tin email từ token

  try {
    // Kết nối với cơ sở dữ liệu
    const pool = await sql.connect(sqlConfig);

    // Truy vấn lịch sử in của người dùng theo email
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .query(`
        SELECT pages_to_buy, total_amount, status, created_at
        FROM payments
        WHERE email = @email
        ORDER BY created_at DESC
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy." });
    }

    // Trả về danh sách lịch sử in
    res.status(200).json({ payments: result.recordset });
  } catch (err) {
    console.error("Lỗi :", err);
    res.status(500).json({ message: "Lỗi." });
  }
});
// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
