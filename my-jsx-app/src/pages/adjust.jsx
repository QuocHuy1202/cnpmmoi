import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from "../image/image.png";
import avar from "../image/avar.svg";
import "../css/printhistory.css";
import "../css/adjust.css";

export const AdjustPrint = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [students, setStudents] = useState([]);
  const [defaultPages, setDefaultPages] = useState(0);
  const [allowedFormats, setAllowedFormats] = useState([]);
  const [printLimit, setPrintLimit] = useState(0);
  const [Time, setTime] = useState("");
  const [studentIdInput, setStudentIdInput] = useState("");
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false); // Popup for avatar
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Hook to navigate user
  const toggleAvatarPopup = () => {
    setIsAvatarPopupOpen(!isAvatarPopupOpen); // Toggle avatar popup
  };

  const handleLogout = () => {
    localStorage.clear(); // Xóa tất cả các mục trong localStorage
    setIsLoggedIn(false); // Update the logged-in status
    navigate("/login"); // Redirect user to the login page
  };
  // Sample data for testing
  const sampleStudents = [
    { id: "2234567", name: "Student 1", defaultPages: 10 },
    { id: "2234568", name: "Student 2", defaultPages: 15 },
  ];

  const sampleFormats = ["PDF", "DOCX", "TXT"];
  // ktra login
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    // Use sample data instead of fetching from API
    setStudents(sampleStudents);
    setAllowedFormats(sampleFormats);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleAllowedFormatsChange = (e) => {
    const format = e.target.value;
    setAllowedFormats(
      allowedFormats.includes(format)
        ? allowedFormats.filter((f) => f !== format)
        : [...allowedFormats, format]
    );
  };

  const handlePrintLimitChange = (e) => {
    setPrintLimit(e.target.value);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleStudentIdInputChange = (e) => {
    setStudentIdInput(e.target.value);
  };

  const applyDefaultPagesToStudent = () => {
    setStudents(
      students.map((student) =>
        student.id === studentIdInput ? { ...student, defaultPages } : student
      )
    );
  };

  return (
    <div className="app">
      <header className="header">
        <img src={image} alt="Logo" className="logo" />
        <nav className="navbar">
          {isMobileView ? (
            <button className="menu-button" onClick={togglePopup}>
              ☰
            </button>
          ) : (
            <nav className="navbar">
              <Link to="/spso" className="trangchuadj">
                Trang chủ
              </Link>
              <Link to="/managerprint" className="quanliadj">
                Quản lí máy in
              </Link>
              <Link to="/adjust" className="dieuchinhadj">
                Điều chỉnh
              </Link>
              <Link to="/historyspso" className="xemadj">
                Xem lịch sử in
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
            <li onClick={handleLogout}>Log out</li>
          </ul>
        </div>
      )}
      <div className="adjust-content">
        <h1>Điều chỉnh</h1>
        <div className="adjust-section">
          <div className="page-defailt">
            <h2>Chỉnh sửa số trang in mặc định</h2>
            <input
              type="number"
              value={defaultPages}
              onChange={(e) => setDefaultPages(e.target.value)}
            />
          </div>
          <div className="adjust-section1">
            <h2>Kiểm soát các định dạng file cho phép in</h2>
            {sampleFormats.map((format) => (
              <div key={format} className="format-adjust">
                <input
                  type="checkbox"
                  value={format}
                  checked={allowedFormats.includes(format)}
                  onChange={handleAllowedFormatsChange}
                />
                <label>{format}</label>
              </div>
            ))}
          </div>
          <div className="adjust-section2">
            <h2>Đặt giới hạn về số lượng bản in cho 1 lần in</h2>
            <input
              type="number"
              value={printLimit}
              onChange={handlePrintLimitChange}
            />
          </div>
          <div className="adjust-section2">
            <h2>Đặt thời gian cấp mặc định</h2>
            <input type="number" value={Time} onChange={handleTimeChange} />
            <h2>Ngày</h2>
          </div>
          <button
            onClick={() =>
              setStudents(
                students.map((student) => ({ ...student, defaultPages }))
              )
            }
          >
            Áp dụng cho tất cả sinh viên
          </button>
        </div>
        <div className="adjust-section3">
          <h4>Áp dụng cho sinh viên cụ thể</h4>
          <input
            type="text"
            placeholder="Nhập MSSV"
            value={studentIdInput}
            onChange={handleStudentIdInputChange}
          />
          <button onClick={applyDefaultPagesToStudent}>Áp dụng</button>
        </div>
      </div>
      {isPopupOpen && isMobileView && (
        <div className="popup">
          <ul>
            <Link to="/spso" onClick={togglePopup}>
              <li>Trang Chủ</li>
            </Link>
            <Link to="/managerprint" onClick={togglePopup}>
              <li>Quản lí máy in</li>
            </Link>
            <Link to="/adjust" onClick={togglePopup}>
              <li>Điều chỉnh</li>
            </Link>
            <Link to="/historyspso" onClick={togglePopup}>
              <li>Xem lịch sử in</li>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
};
