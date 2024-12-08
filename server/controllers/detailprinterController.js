const { getFullPrintHistoryByPrinterID } = require("../models/detailprinterModel");

// Controller: Lấy lịch sử in đầy đủ của máy in
const getFullPrintHistoryController = async (req, res) => {

  try {
    const fullPrintHistory = await getFullPrintHistoryByPrinterID();

    if (fullPrintHistory.length > 0) {
      res.status(200).json(fullPrintHistory); // Trả về dữ liệu lịch sử in đầy đủ
    } else {
      res.status(404).json({ message: "Không có lịch sử in cho máy in này." });
    }
  } catch (error) {
    console.error("Lỗi trong getFullPrintHistoryController:", error);
    res.status(500).json({ message: "Lỗi server khi lấy lịch sử in đầy đủ.", error: error.message });
  }
};

module.exports = { getFullPrintHistoryController };
