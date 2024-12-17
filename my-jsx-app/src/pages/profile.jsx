import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/profile.css";
import avar from "../image/avar.svg";
import image from "../image/image.png";
import axios from "axios";
export const Profile = () => {
  const [pagesToBuy, setPagesToBuy] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(null); // Trạng thái thanh toán
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [faculty, setFalcuty] = useState("");
  const [MSSV, setMSSV] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [numberOfPagesRemaining, setNumberOfPagesRemaining] = useState(0);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false); // Popup for avatar
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 
  const navigate = useNavigate(); // Khởi tạo hook useHistory
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
    if(!token ) {navigate("/login");}
   
  }, []);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5001/api/account/get", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        
        setStatus(response.data.status);
        setNumberOfPagesRemaining(response.data.number_of_pages_remaining);
        setName(response.data.name);
        setFalcuty(response.data.faculty);
        setMSSV(response.data.mssv)
      })
      .catch(error => {
        console.error("Error fetching printers:", error);
      });
    }, []);
  
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Load thông tin từ localStorage khi component load
 
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  // Hàm để điều hướng đến trang thanh toán
  const handlePayMentList = () => {
    navigate("/paymentlist"); // Điều hướng đến trang thanh toán
  };
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
      const response = await fetch("http://localhost:5001/api/payment", {
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
    <div className="profile-container">
      <header className="header">
        <img src={image} alt="Logo" className="logo" />
        <nav className="navbar">
          {isMobileView ? (
            <button className="menu-button" onClick={togglePopup}>
              ☰
            </button>
          ) : (
            <nav className="navbar">
              <Link to="/" className="trangchupro">
                Trang chủ
              </Link>
              <Link to="/print" className="inpro">
                In
              </Link>
              <Link to="/history" className="xemlspro">
                Xem lịch sử in ấn
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
      <div className="noidung">
        <div className="profile-card">
          <h2 className="profile-title">Thông tin tài khoản</h2>
          <div className="profile-info">
          <p>
              Tên: <span>{name}</span>
            </p>
            <p>
              MSSV: <span>{MSSV}</span>
            </p>
            <p>
              Khoa: <span>{faculty}</span>
            </p>
            <p>
              Trạng thái: <span>{status}</span>
            </p>
            <p>
              Số trang còn lại: <span>{numberOfPagesRemaining}</span>
            </p>
          </div>
          <button className="profile-button" onClick={handlePayMentList}>
            Lịch sử mua giấy
          </button>
        </div>
        <div className="payment-card">
          <h2 className="payment-title">Mua thêm giấy in</h2>
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

      {isPopupOpen && isMobileView && (
        <div className="popup">
          <ul>
            <Link to="/" onClick={togglePopup}>
              <li>Trang Chủ</li>
            </Link>
            <Link to="/print" onClick={togglePopup}>
              <li>In</li>
            </Link>
            <Link to="/history" onClick={togglePopup}>
              <li>Xem lịch sử in ấn</li>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
};
