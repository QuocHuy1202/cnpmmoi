const connectDB = require("../config/sqlConfig");

const getFilesByEmail = async (email) => {
  const pool = await connectDB();
  const result = await pool.request()
        .input("email", email)
        .query("SELECT * FROM files WHERE email = @email");
  return result;
};


const saveFileInfo = async (email, fileName, filePath, fileType) => {
  let pool;
  try {
    pool = await connectDB();
    await pool.request()
      .input("email", email)
      .input("fileName", fileName)
      .input("filePath", filePath)
      .input("fileType", fileType)
      .query(`
        INSERT INTO files (email, file_name, file_path, file_type)
        VALUES (@email, @fileName, @filePath, @fileType)
      `);
  } catch (err) {
    console.error("Error saving file info to database:", err);
    throw new Error("Error saving file info to database");
  } finally {
    if (pool) {
      pool.close();
    }
  }
};

module.exports = { getFilesByEmail, saveFileInfo };


