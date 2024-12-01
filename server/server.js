const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const sql = require("mssql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const app = express();
const port = 5000;

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

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error during authentication" });
  }
});

// File upload endpoint
// File upload endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  const { email } = req.body;
  const file = req.file;

  if (!file || !email) {
    return res.status(400).json({ message: "Email and file are required." });
  }

  try {
    // Upload file to Cloudinary using cloudinary.uploader.upload
    cloudinary.uploader.upload_stream(
      { 
        resource_type: "auto",  // Tự động nhận diện loại file (ví dụ: hình ảnh, video, PDF, ...)
        access_mode: "public"   // Đảm bảo tệp là công khai
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Error uploading file to Cloudinary", error });
        }

        const filePath = result.secure_url; // Cloudinary trả về URL của file đã upload

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

          res.status(200).json({ message: "File uploaded successfully to Cloudinary.", filePath });
        } catch (err) {
          console.error("Error saving file info to database:", err);
          res.status(500).json({ message: "Error saving file info to database." });
        }
      }
    ).end(file.buffer); // Truyền file.buffer vào .upload_stream để tải lên Cloudinary
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error uploading file." });
  }
});

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
// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
