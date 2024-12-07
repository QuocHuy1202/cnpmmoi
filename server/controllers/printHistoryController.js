const { getPrintHistory } = require("../models/printHistoryModel");

// Controller lấy danh sách lịch sử in
const getPrintHistoryController = async (req, res) => {
  try {
    const printHistory = await getPrintHistory(); // Lấy dữ liệu từ model
    if (printHistory.length > 0) {
      res.status(200).json(printHistory); // Trả về dữ liệu JSON
    } else {
      res.status(404).json({ message: "Không có lịch sử in nào." });
    }
  } catch (error) {
    console.error("Lỗi trong getPrintHistoryController:", error);
    res.status(500).json({ message: "Lỗi server khi lấy lịch sử in.", error });
  }
};

module.exports = { getPrintHistoryController };
