const connectDB = require("../config/sqlConfig");

const getAllowedFiles = async () => {
  const pool = await connectDB();
  const result = await pool
    .query(`
      SELECT * FROM Allowed_file
  `);
  return result.recordset;
};


const deleteAllowedFileById = async (id) => {
  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('ID', id)
      .query('DELETE FROM Allowed_file WHERE ID = @ID');
    return result.rowsAffected > 0; // Trả về true nếu xóa thành công
  } catch (error) {
    console.error('Error deleting allowed file:', error);
    throw error;
  }
};

const addFileFormat = async (fileType) => {
  try {
    const pool = await connectDB();
    const result = await pool.request()
      .input('file_type_allowed', fileType)
      .query('INSERT INTO Allowed_file (file_type_allowed) VALUES (@file_type_allowed)');

    if (result.rowsAffected > 0) {
      return { file_type_allowed: fileType }; // Trả về đối tượng file_type_allowed nếu thêm thành công
    } else {
      throw new Error('Không thể thêm định dạng file');
    }
  } catch (error) {
    console.error('Error adding file format:', error);
    throw error; // Trả về lỗi nếu xảy ra vấn đề trong quá trình thêm
  }
};


const getCurrentProvideDate = async () => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query(`
      SELECT 
        (SELECT TOP 1 provide_pages_date FROM Standard_pages ORDER BY provide_pages_date DESC) AS currentProvideDate,
        (SELECT TOP 1 standard_pages_provide FROM Standard_pages ORDER BY provide_pages_date DESC) AS currentDefaultPages,
        (SELECT TOP 1 limit_copy_per_print FROM Standard_pages ORDER BY provide_pages_date DESC) AS currentPrintLimit
    `);

    return result.recordset[0]; // Trả về kết quả đầu tiên
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const updateStandardPage = async (provide_pages_date, standard_pages_provide, limit_copy_per_print) => {
  try {
    const pool = await connectDB();
    
    const result = await pool.request()
      .input('provide_pages_date', provide_pages_date)
      .input('standard_pages_provide', standard_pages_provide)
      .input('limit_copy_per_print', limit_copy_per_print)
      .query(`
        UPDATE TOP (1) Standard_pages
        SET provide_pages_date = @provide_pages_date,
            standard_pages_provide = @standard_pages_provide,
            limit_copy_per_print = @limit_copy_per_print
        WHERE provide_pages_date IS NOT NULL
      `);

    return result.rowsAffected > 0;
  } catch (error) {
    console.error('Lỗi khi kết nối đến database:', error);
    throw new Error('Error updating database');
  }
};

module.exports = { getAllowedFiles, deleteAllowedFileById, addFileFormat, getCurrentProvideDate, updateStandardPage, };