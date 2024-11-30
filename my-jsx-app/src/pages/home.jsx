import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from "../image/image.png";
import chuong from "../image/chuong.png";
import mess from "../image/mess.png";
import avar from "../image/avar.svg";  // Avatar image path
import "../css/home.css";

export const Homen = () => {
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);  // Popup for mobile menu
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);  // Popup for avatar
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // State to check login status
  const navigate = useNavigate();  // Hook to navigate user

  // Xử lý thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);  // Set login status based on token existence
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");  // Remove token from localStorage
    setIsLoggedIn(false);  // Update the logged-in status
    navigate("/login");  // Redirect user to the login page
  };

  // Functions to toggle popups
  const toggleMenuPopup = () => {
    setIsMenuPopupOpen(!isMenuPopupOpen);  // Toggle menu popup
  };

  const toggleAvatarPopup = () => {
    setIsAvatarPopupOpen(!isAvatarPopupOpen);  // Toggle avatar popup
  };

  return (
    <div className="app">
      {/* Header chứa logo và điều hướng */}
      <header className="header">
        <img src={image} alt="Logo" className="logo" />
        <nav className="navbar">
          {isMobileView ? (
            <button className="menu-button" onClick={toggleMenuPopup}>
              ☰
            </button>
          ) : (
            <nav className="navbar">
              <Link to="/" className="trangchu">
                Trang chủ
              </Link>
              <Link to="/print" className="in">
                In
              </Link>
              <Link to="/history" className="xem">
                Xem lịch sử in ấn
              </Link>
            </nav>
          )}
        </nav>

        {/* Nếu người dùng đã đăng nhập, hiển thị avatar */}
        {isLoggedIn ? (
          <div className="avatar-link" onClick={toggleAvatarPopup}>
            <img src={avar} alt="hAnh" className="hAnh" />  {/* Avatar */}
          </div>
        ) : (
          <Link to="/login" className="dangnhap">
                Đăng nhập
              </Link>
        )}
      </header>

      {/* Popup Avatar */}
      {isAvatarPopupOpen && isLoggedIn && (
        <div className="avatar-popup">
          <ul>
            <li><Link to="/profile" onClick={toggleAvatarPopup}>Profile</Link></li>
            <li onClick={handleLogout}>Log out</li>
          </ul>
        </div>
      )}

      {/* Popup Menu cho thiết bị di động */}
      {isMenuPopupOpen && isMobileView && (
        <div className="popup">
          <ul>
            <Link to="/" onClick={toggleMenuPopup}><li>Trang Chủ</li></Link>
            <Link to="/print" onClick={toggleMenuPopup}><li>In</li></Link>
            <Link to="/history" onClick={toggleMenuPopup}><li>Xem lịch sử in ấn</li></Link>
          </ul>
        </div>
      )}

      {/* Nội dung trang */}
      <div className="overlap-2">
        <div className="welcome-section">
          <h1>Dịch vụ in ấn thông minh dành cho sinh viên</h1>
          <p>(HCMUT-SPSS)</p>
        </div>
      </div>
    </div>
  );
};
