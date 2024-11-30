import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import image from "../image/image.png";
import chuong from "../image/chuong.png";
import mess from "../image/mess.png";
import avar from "../image/avar.svg";
import "../css/printhistory.css";

export const PrintHistory = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [historyData, setHistoryData] = useState([]);

  // Giả sử bạn có API trả về lịch sử in ấn
  useEffect(() => {
    // Thay thế bằng API thực tế để lấy lịch sử in ấn
    fetch("/api/print-history")
      .then(response => response.json())
      .then(data => setHistoryData(data))
      .catch(error => console.error("Error fetching print history:", error));
  }, []);

  // Xử lý thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div className="app">
      {/* Header chứa logo và điều hướng */}
      <header className="header">
        <img src={image} alt="Logo" className="logo" />
        <nav className="navbar">
          {isMobileView ? (
            <button className="menu-button" onClick={togglePopup}>
              ☰
            </button>
          ) : (
            <nav className="navbar">
              <Link to="/" className="trangchuls">Trang chủ</Link>
              <Link to="/print" className="in">In</Link>
              <Link to="/history" className="xemls">Xem lịch sử in ấn</Link>
            </nav>
          )}
        </nav>
        <img src={chuong} alt="Tbao" className="Tbao" /> {/* CHuong*/}
        <img src={mess} alt="tnhan" className="tnhan" /> {/* hop thoại */}
        <button className="setting"></button>
        <img src={avar} alt="hAnh" className="hAnh" /> {/* avarta */}
      </header>

      {/* Nội dung trang: Bảng lịch sử in ấn */}
      <div className="history-content">
        <h1>Lịch sử in ấn</h1>
        {historyData.length === 0 ? (
          <p>Không có lịch sử in ấn nào.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Ngày</th>
                <th>Tên người dùng</th>
                <th>Số lượng trang</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.date}</td>
                  <td>{item.username}</td>
                  <td>{item.pageCount}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Popup menu cho thiết bị di động */}
      {isPopupOpen && isMobileView && (
        <div className="popup">
          <ul>
            <Link to="/" onClick={togglePopup}><li>Trang Chủ</li></Link>
            <Link to="/print" onClick={togglePopup}><li>In</li></Link>
            <Link to="/history" onClick={togglePopup}><li>Xem lịch sử in ấn</li></Link>
          </ul>
        </div>
      )}
    </div>
  );
};
