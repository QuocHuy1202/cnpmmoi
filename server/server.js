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

    const token = jwt.sign({ email: user.email }, "jwt_secret_key", { expiresIn: "1h" });

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

app.get("/api/files/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const pool = await sql.connect(sqlConfig);
    
    // Truy vấn cơ sở dữ liệu để lấy thông tin các tệp của email
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM files WHERE email = @email");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No files found for this email." });
    }

    // Trả về danh sách các tệp
    const files = await Promise.all(result.recordset.map(async (file) => {
      const filePath = file.file_path;

      // Trích xuất public_id từ URL của file_path
      const urlParts = filePath.split('/');
      const public_id = urlParts[urlParts.length - 1].split('.')[0]; // Lấy phần public_id từ URL

      // Lấy thông tin ảnh từ Cloudinary bằng public_id
      const cloudinaryResult = await new Promise((resolve, reject) => {
        cloudinary.api.resource(public_id, function(error, result) {
          if (error) {
            reject(error); // Nếu có lỗi thì reject
          } else {
            resolve(result); // Nếu thành công thì resolve với kết quả
          }
        });
      });

      return {
        fileName: file.file_name,
        filePath: cloudinaryResult.secure_url, // Lấy URL từ Cloudinary
        fileType: file.file_type,
      };
    }));

    res.status(200).json({ files });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error fetching files." });
  }
});
const publicId = 'your_pdf_public_id';  // Thay bằng public ID của tệp PDF bạn muốn lấy URL

// Tạo Signed URL
const signedUrl = cloudinary.url(publicId, {
  resource_type: 'raw', // Đối với tài nguyên không phải hình ảnh (như PDF)
  sign_url: true,       // Yêu cầu Cloudinary tạo chữ ký cho URL
  expiration: 3600      // Thời gian hết hạn của URL (1 giờ ở đây, có thể thay đổi)
});

console.log('Signed URL:', signedUrl);
// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
