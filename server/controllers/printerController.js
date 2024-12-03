const { getAllPrinters, createPrintRequest, getPrintHistoryByEmail } = require("../models/printerModel");

async function fetchPrinters(req, res) {
  try {
    const printers = await getAllPrinters();
    res.status(200).json(printers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const handlePrintRequest = async (req, res) => {
  const { fileDetails, printSettings, printer } = req.body;
  const { email } = req.user; // Lấy email từ token đã xác thực

  // Kiểm tra xem dữ liệu có đầy đủ không
  if (!fileDetails || !fileDetails.name || !printer || !printSettings) {
    return res.status(400).json({ message: "Thông tin in không đầy đủ. Vui lòng kiểm tra lại." });
  }

  // Tạo dữ liệu yêu cầu in
  const requestPayload = {
    email,
    fileName: fileDetails.name,
    printer,
    printSettings: JSON.stringify(printSettings), // Lưu cài đặt in dưới dạng chuỗi JSON
    status: "Completed",
  };

  try {
    // Gọi Model để lưu thông tin yêu cầu in vào cơ sở dữ liệu
    await createPrintRequest(requestPayload);

    // Giả lập quá trình in
    console.log("Đang xử lý in...");
    console.log("In file:", fileDetails.name);
    console.log("Máy in:", printer);
    console.log("Cài đặt in:", printSettings);

    // Trả về thông báo thành công
    res.status(200).json({ message: "In thành công!" });
  } catch (err) {
    console.error("Lỗi khi xử lý yêu cầu in:", err);
    res.status(500).json({ message: "Lỗi trong quá trình in. Vui lòng thử lại." });
  }
};

const getPrintHistory = async (req, res) => {
  const { email } = req.user; // Lấy email từ token đã xác thực

  try {
    // Gọi Model để lấy lịch sử in
    const history = await getPrintHistoryByEmail(email);

    if (history.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy lịch sử in." });
    }

    // Trả về danh sách lịch sử in
    res.status(200).json({ history });
  } catch (err) {
    console.error("Lỗi khi lấy lịch sử in:", err);
    res.status(500).json({ message: "Lỗi khi lấy lịch sử in." });
  }
};



module.exports = {
  fetchPrinters,
  handlePrintRequest,
  getPrintHistory,
};
