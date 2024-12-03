import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/payment.css";

export const Payment = () => {
  const [pagesToBuy, setPagesToBuy] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  const handlePagesChange = (event) => {
    const pages = event.target.value;
    setPagesToBuy(pages);
    const amount = pages * 500;
    setTotalAmount(amount);
  };

  const handlePaymentSubmit = async () => {
    if (pagesToBuy <= 0) {
      alert("Vui lòng nhập số trang cần mua.");
      return;
    }

    setPaymentStatus("Pending");

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vui lòng đăng nhập trước khi thanh toán.");
      navigate("/login");
      return;
    }

    try {

      const response = await fetch("http://localhost:5001/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pagesToBuy,
          totalAmount,
          status: "Pending",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Yêu cầu thành công, vui lòng lên BKPay để thanh toán`);
        navigate("/");
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
            <p>
              {paymentStatus === "Pending"
                ? "Đang xử lý thanh toán..."
                : "Thanh toán hoàn tất!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
