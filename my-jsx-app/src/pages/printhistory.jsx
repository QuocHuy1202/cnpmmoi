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
  const [selectedPrintSettings, setSelectedPrintSettings] = useState(null); // Lưu cài đặt in đã chọn

  useEffect(() => {
    const fetchPrintHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/history", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Lịch sử in:", result.history);
          setHistoryData(result.history); // Lưu dữ liệu vào state
        } else {
          const error = await response.json();
          alert(`Lỗi khi lấy lịch sử in: ${error.message}`);
        }
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử in:", err);
        alert("Không thể lấy lịch sử in. Vui lòng thử lại.");
      }
    };

    fetchPrintHistory(); // Gọi API khi component được mount
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const showPrintSettings = (settings) => {
    setSelectedPrintSettings(settings); // Cập nhật cài đặt in đã chọn
    togglePopup(); // Mở popup
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
              <Link to="/" className="trangchuls">Trang chủ</Link>
              <Link to="/print" className="in">In</Link>
              <Link to="/history" className="xemls">Xem lịch sử in ấn</Link>
            </nav>
          )}
        </nav>
        <img src={chuong} alt="Tbao" className="Tbao" />
        <img src={mess} alt="tnhan" className="tnhan" />
        <button className="setting"></button>
        <img src={avar} alt="hAnh" className="hAnh" />
      </header>

      <div className="history-content">
        <h1>Lịch sử in ấn</h1>
        {historyData.length === 0 ? (
          <p>Không có lịch sử in ấn nào.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên file</th>
                <th>Máy in</th>
                <th>Cài đặt in</th>
                <th>Trạng thái</th>
                <th>Ngày</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.file_name}</td>
                  <td>{item.printer}</td>
                  <td>
                    <button
                      className="view-settings-btn"
                      onClick={() => showPrintSettings(JSON.parse(item.print_settings))}
                    >
                      Xem cài đặt
                    </button>
                  </td>
                  <td>{item.status}</td>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Popup hiển thị cài đặt in */}
      {isPopupOpen && selectedPrintSettings && (
        <div className="settings-popup">
          <div className="popup-content">
            <h2>Cài đặt in chi tiết</h2>
            <pre>{JSON.stringify(selectedPrintSettings, null, 2)}</pre>
            <button className="close-btn" onClick={togglePopup}>Đóng</button>
          </div>
        </div>
      )}

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
