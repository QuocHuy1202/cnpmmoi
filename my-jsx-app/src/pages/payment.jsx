import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/payment.css";

export const Payment = () => {
  const [pagesToBuy, setPagesToBuy] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(null); // Trạng thái thanh toán
  const navigate = useNavigate();

  // Xử lý khi nhập số trang cần mua
  const handlePagesChange = (event) => {
    const pages = event.target.value;
    setPagesToBuy(pages);
    const amount = pages * 500; // Giả sử mỗi trang có giá 500 đồng
    setTotalAmount(amount);
  };

  // Xử lý khi bấm thanh toán
  const handlePaymentSubmit = async () => {
    if (pagesToBuy <= 0) {
      alert("Vui lòng nhập số trang cần mua.");
      return;
    }

    setPaymentStatus("Pending");

    // Lấy token từ localStorage
    const token = localStorage.getItem("token");

    // Kiểm tra nếu không có token thì yêu cầu đăng nhập
    if (!token) {
      alert("Vui lòng đăng nhập trước khi thanh toán.");
      navigate("/login"); // Chuyển đến trang login nếu không có token
      return;
    }

    try {
      // Gửi request thanh toán đến API
      const response = await fetch("http://localhost:5000/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
        },
        body: JSON.stringify({
          pagesToBuy,
          totalAmount,
          status: "Pending", // Gửi status thanh toán
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Yêu cầu thành công, vui lòng lên BKPay để thanh toán`);
        navigate("/"); // Quay lại trang Profile sau khi thanh toán thành công
      } else {
        const errorData = await response.json();
        setPaymentStatus("Failed");
        alert(errorData.message || "Thanh toán thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      setPaymentStatus("Failed");
      alert("Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.");
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2 className="payment-title">Thanh Toán</h2>
        <div className="payment-info">
          <label htmlFor="pages" className="payment-label">
            Nhập số trang cần mua:
          </label>
          <input
            type="number"
            id="pages"
            value={pagesToBuy}
            onChange={handlePagesChange}
            className="payment-input"
            placeholder="Số trang"
          />
        </div>
        <div className="payment-amount">
          <p>Tổng số tiền: {totalAmount} VND</p>
        </div>
        <button className="payment-button" onClick={handlePaymentSubmit}>
          Thanh Toán
        </button>
        {paymentStatus && (
          <div className="payment-status">
            <p>{paymentStatus === "Pending" ? "Đang xử lý thanh toán..." : "Thanh toán hoàn tất!"}</p>
          </div>
        )}
      </div>
    </div>
  );
};


