const jwt = require("jsonwebtoken");
const { getAllowedFiles, deleteAllowedFileById, addFileFormat, getCurrentProvideDate, updateStandardPage, } = require("../models/adjustModel");

const getAllowedFileTypes = async (req, res) => {
  try {
    const allowedFiles = await getAllowedFiles();  // Gọi hàm trong model
    if (allowedFiles.length > 0) {
      res.status(200).json(allowedFiles);  // Trả về danh sách file types dưới dạng JSON
    } else {
      res.status(404).json({ message: 'Không có loại file được phép nào.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu', error });
  }
};

const deleteAllowedFile = async (req, res) => {
  const { id } = req.params; // Lấy ID từ URL parameters
  try {
    const result = await deleteAllowedFileById(id); // Gọi model để xóa dữ liệu
    if (result) {
      res.status(200).json({ message: 'Loại file đã được xóa' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy loại file để xóa' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa dữ liệu', error });
  }
};

const addFileFormatController = async (req, res) => {
  const { file_type_allowed } = req.body;

  // Kiểm tra nếu không có file_type_allowed trong body
  if (!file_type_allowed) {
    return res.status(400).json({ message: 'Định dạng file không thể để trống.' });
  }

  try {
    // Gọi model để thêm định dạng file vào cơ sở dữ liệu
    const newFileFormat = await addFileFormat(file_type_allowed);
    res.status(201).json(newFileFormat); // Trả về thông tin định dạng file mới thêm vào
  } catch (error) {
    console.error('Error in addFileFormatController:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi thêm định dạng file.' });
  }
};


const getCurrentStatus = async (req, res) => {
  try {
    const data = await getCurrentProvideDate(); // Lấy dữ liệu từ model
    if (data) {
      res.json({
        currentProvideDate: data.currentProvideDate,
        currentDefaultPages: data.currentDefaultPages,
        currentPrintLimit: data.currentPrintLimit,
      });
    } else {
      res.status(404).json({ message: 'Không tìm thấy dữ liệu.' });
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    res.status(500).json({ message: 'Lỗi khi truy vấn cơ sở dữ liệu.' });
  }
};

const saveDate = async (req, res) => {
  const { provide_pages_date, standard_pages_provide, limit_copy_per_print } = req.body;

  // Kiểm tra giá trị đầu vào
  if (!provide_pages_date || !standard_pages_provide || !limit_copy_per_print) {
    return res.status(400).json({ message: 'Thiếu dữ liệu cần thiết.' });
  }

  // const parsedDate = new Date(provide_pages_date);
  // if (isNaN(parsedDate.getTime())) {
  //   return res.status(400).json({ message: 'Ngày không hợp lệ.' });
  // }
  const datetime = provide_pages_date;
  const date = datetime.split("T")[0];  // Lấy phần trước "T"
  console.log(date);

  try {
    // Gọi hàm model để cập nhật dữ liệu
    const isUpdated = await updateStandardPage(date, standard_pages_provide, limit_copy_per_print);

    if (isUpdated) {
      res.status(200).json({ message: 'Dữ liệu đã được cập nhật thành công.' });
    } else {
      res.status(500).json({ message: 'Có lỗi khi cập nhật dữ liệu vào database.' });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật dữ liệu:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật dữ liệu.' });
  }
};

module.exports = { getAllowedFileTypes, deleteAllowedFile, addFileFormatController, getCurrentStatus, saveDate, };
