const jwt = require("jsonwebtoken");
const { getFilesByEmail } = require("../models/fileModel");

const files = async (req, res) => {
    const  email  = req.user.id;

    try {
      
      // Lấy danh sách file theo email
      const result = await getFilesByEmail(email);

      if (result.recordset.length === 0) {
        return res.status(404).json({ message: "No files found for this email." });
      }
  
      // Trả danh sách file
      res.status(200).json({ files: result.recordset });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ message: "Error fetching files." });
    }
};

const cloudinary = require("../config/cloudinaryConfig");
const { saveFileInfo } = require("../models/fileModel");
const path = require("path");

const uploadFile = async (req, res) => {
  const  email  = req.user.id;  // Lấy email từ token
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "File is required." });
  }

  try {
    // Upload file to Cloudinary
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        access_mode: "public",
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Error uploading file to Cloudinary", error });
        }

        const filePath = result.secure_url;

        // Save file info to database
        try {
          await saveFileInfo(
            email,
            file.originalname,
            filePath,
            path.extname(file.originalname).substring(1)
          );

          res.status(200).json({ message: "File uploaded successfully to Cloudinary.", filePath });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      }
    ).end(file.buffer);
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ message: "Error uploading file." });
  }
};




module.exports = { files, uploadFile };
