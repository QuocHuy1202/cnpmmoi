import React, { useState, useEffect } from "react";
import image from "../image/image.png";
import { Link, useNavigate } from "react-router-dom";
import "../css/spso.css";
import avar from "../image/avar.svg"; // Avatar image path

export const SPSO = () => {
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false); // Popup for mobile menu
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false); // Popup for avatar
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check login status
  const navigate = useNavigate(); // Hook to navigate user
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/employees")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error:", error));
  }, []);
  // Xử lý thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsLoggedIn(false); // Update the logged-in status
    navigate("/login"); // Redirect user to the login page
  };

  // Functions to toggle popups
  const toggleMenuPopup = () => {
    setIsMenuPopupOpen(!isMenuPopupOpen); // Toggle menu popup
  };

  const toggleAvatarPopup = () => {
    setIsAvatarPopupOpen(!isAvatarPopupOpen); // Toggle avatar popup
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
              <Link to="/spso" className="trangchuspso">
                Trang chủ
              </Link>
              <Link to="/managerprint" className="quanlispso">
                Quản lí máy in
              </Link>
              {/* đổi lại đường dẫn */}
              <Link to="/adjust" className="dieuchinhspso">
                Điều chỉnh
              </Link>
              {/* đổi lại đường dẫn */}
              <Link to="/historyspso" className="xemspso">
                Xem lịch sử in
              </Link>
              {/* đổi lại đường dẫn */}
            </nav>
          )}
        </nav>

        {/* Nếu người dùng đã đăng nhập, hiển thị avatar */}
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

      {/* Popup Avatar */}
      {isAvatarPopupOpen && isLoggedIn && (
        <div className="avatar-popup">
          <ul>
            <li onClick={handleLogout}>Log out</li>
          </ul>
        </div>
      )}

      {/* Popup Menu cho thiết bị di động */}
      {isMenuPopupOpen && isMobileView && (
        <div className="popup">
          <ul>
            <Link to="/spso" onClick={toggleMenuPopup}>
              <li>Trang Chủ</li>
            </Link>
            <Link to="/managerprint" onClick={toggleMenuPopup}>
              <li>Quản lí máy in</li>
            </Link>
            <Link to="/adjust" onClick={toggleMenuPopup}>
              <li>Điều chỉnh</li>
            </Link>
            <Link to="/historyspso" onClick={toggleMenuPopup}>
              <li>Xem lịch sử</li>
            </Link>
          </ul>
        </div>
      )}

      {/* Nội dung trang */}
      <div className="overlap-2">
        <div className="welcome-section">
          <h1>Quản lí dịch vụ in ấn thông minh dành cho sinh viên</h1>
          <p>(Dành cho nhân viên quản lí - SPSO)</p>
        </div>
      </div>
      {data.map((item) => (
        <div key={item.StudentID}>
          <p>{item.FirstName}</p>
        </div>
      ))}
    </div>
  );
};
