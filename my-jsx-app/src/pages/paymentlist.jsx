import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import image from "../image/image.png";
import chuong from "../image/chuong.png";
import mess from "../image/mess.png";
import avar from "../image/avar.svg";
import "../css/printhistory.css";

export const PaymentHistory = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5001/payment-history", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Lịch sử thanh toán:", result.payments);
          setPaymentData(result.payments); // Lưu dữ liệu thanh toán vào state
        } else {
          const error = await response.json();
          alert(`Lỗi khi lấy lịch sử thanh toán: ${error.message}`);
        }
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử thanh toán:", err);
        alert("Không thể lấy lịch sử thanh toán. Vui lòng thử lại.");
      }
    };

    fetchPaymentHistory(); // Gọi API khi component được mount
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app">
      <header className="header">
        <img src={image} alt="Logo" className="logo" />
        <nav className="navbar">
          {isMobileView ? (
            <button className="menu-button">☰</button>
          ) : (
            <nav className="navbar">
              <Link to="/" className="trangchuls">
                Trang chủ
              </Link>
              <Link to="/payment-history" className="xemls">
                Xem lịch sử thanh toán
              </Link>
            </nav>
          )}
        </nav>
        <img src={chuong} alt="Tbao" className="Tbao" />
        <img src={mess} alt="tnhan" className="tnhan" />
        <button className="setting"></button>
        <img src={avar} alt="hAnh" className="hAnh" />
      </header>

      <div className="history-content">
        <h1>Lịch sử thanh toán</h1>
        {paymentData.length === 0 ? (
          <p>Không có lịch sử thanh toán nào.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Số trang mua</th>
                <th>Thành tiền</th>
                <th>Trạng thái</th>
                <th>Ngày</th>
              </tr>
            </thead>
            <tbody>
              {paymentData.map((item) => (
                <tr key={item.id}>
                  <td>{item.pages_to_buy}</td>
                  <td>{item.total_amount} VND</td>
                  <td>{item.status}</td>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
