const { createPayment, getPaymentHistoryByEmail } = require("../models/paymentModel");

const processPayment = async (req, res) => {
  const { pagesToBuy, totalAmount, status } = req.body;
  const  email  = req.user.id; // Lấy email từ token đã xác thực

  try {
    // Gọi Model để lưu thông tin thanh toán
    await createPayment(email, pagesToBuy, totalAmount, status);

    // Trả về thông báo thành công
    res.status(200).json({ message: "Yêu cầu thành công, vui lòng lên BKPay để thanh toán." });
  } catch (err) {
    console.error("Lỗi khi xử lý thanh toán:", err);
    res.status(500).json({ message: "Lỗi trong quá trình thanh toán. Vui lòng thử lại." });
  }
};


const getPaymentHistory = async (req, res) => {
    const  email  = req.user.id; // Lấy email từ token đã xác thực
    
    try {
      // Gọi Model để lấy lịch sử thanh toán
      const payments = await getPaymentHistoryByEmail(email);
  
      if (payments.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy lịch sử thanh toán." });
      }
  
      // Trả về danh sách lịch sử thanh toán
      res.status(200).json({ payments });
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử thanh toán:", err);
      res.status(500).json({ message: "Lỗi khi lấy lịch sử thanh toán." });
    }
  };

module.exports = { processPayment, getPaymentHistory };