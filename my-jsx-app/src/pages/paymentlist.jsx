import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import image from "../image/image.png";
import chuong from "../image/chuong.png";
import mess from "../image/mess.png";
import avar from "../image/avar.svg";
import "../css/printhistory.css";
import { useNavigate } from "react-router-dom";
export const PaymentHistory = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false); // Popup for avatar
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const toggleAvatarPopup = () => {
    setIsAvatarPopupOpen(!isAvatarPopupOpen); // Toggle avatar popup
  };
  const handleLogout = () => {
    localStorage.clear(); // Xóa tất cả các mục trong localStorage
    // Remove token from localStorage
    setIsLoggedIn(false); // Update the logged-in status
    navigate("/login"); // Redirect user to the login page
  };
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if(!token ) {navigate("/login");} // Set login status based on token existence
  }, []);
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await fetch("http://localhost:5001/api/payment/payment-history", {
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
              <Link to="/paymentlist" className="xemls">
                Xem lịch sử thanh toán
              </Link>
            </nav>
          )}
        </nav>
        {isLoggedIn ? (
          <div className="avatar-link" onClick={toggleAvatarPopup}>
            <img src={avar} alt="hAnh" className="hAnh" /> {/* Avatar */}
          </div>
        ) : (
          <Link to="/login" className="dangnhap">
            Đăng nhập
          </Link>
        )}
      </header>
      {isAvatarPopupOpen && isLoggedIn && (
        <div className="avatar-popup">
          <ul>
            <li>
              <Link to="/profile" onClick={toggleAvatarPopup}>
                Profile
              </Link>
            </li>
            <li onClick={handleLogout}>Log out</li>
          </ul>
        </div>
      )}
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
