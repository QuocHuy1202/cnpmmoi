const { getPrintHistory,getPrintHistorySPSO } = require("../models/printHistoryModel");

// Controller lấy danh sách lịch sử in

const fetchPrintHistory = async (req, res) => {
  const { printerId, mssv } = req.query;

  try {
    const history = await getPrintHistorySPSO(printerId, mssv);
    res.status(200).json(history);
  } catch (err) {
    console.error("Lỗi khi lấy lịch sử in:", err);
    res.status(500).send("Lỗi hệ thống");
  }
};


module.exports = {  fetchPrintHistory };
