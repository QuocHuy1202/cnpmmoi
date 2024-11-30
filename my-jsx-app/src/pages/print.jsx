import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../css/print.css";
import { Link } from "react-router-dom";
import image from "../image/image.png";
import chuong from "../image/chuong.png";
import mess from "../image/mess.png";
import avar from "../image/avar.svg";
import mayin from "../image/may-in.jpg";

export const Print = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [printer, setPrinter] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedFileFromList } = location.state || {};
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  // Hàm xử lý chọn file
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Hàm xử lý chọn máy in
  const handlePrinterChange = (event) => {
    setPrinter(event.target.value);
  };

  // Điều hướng về trang chủ
  const handleGoHome = () => {
    navigate("/"); // Navigate to the homepage
  };
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  // Điều hướng đến trang tải file
  const handleGoloadfile = () => {
    navigate("/loadfile", { state: { selectedFileFromList } });
  };

  // In file
  const handlePrint = () => {
    const fileToPrint = selectedFile || selectedFileFromList; // Kiểm tra file nào có trước

    if (!fileToPrint || !printer) {
      alert("Vui lòng chọn file và máy in.");
      return;
    }

    alert(`Đang in file ${fileToPrint.name || fileToPrint} trên máy ${printer}`);
  };

  // Điều hướng đến trang thiết lập in
  const handleGoToPrintSetting = () => {
    navigate("/printsetting");
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
              <Link to="/" className="trangchu-bot">Trang chủ</Link>
              <Link to="/print" className="in-bot active">In</Link>
              <Link to="/history" className="xem-bot">Xem lịch sử in ấn</Link>
            </nav>
          )}
        </nav>
        <img src={chuong} alt="Tbao" className="Tbao" /> {/* CHuong*/}
        <img src={mess} alt="tnhan" className="tnhan" /> {/* hop thoại */}
        <button className="setting"></button>
        <img src={avar} alt="hAnh" className="hAnh" /> {/* avarta */}
      </header>

      {/* Nội dung chính của trang */}
      <div className="content">
        <div className="groupfield">
          <div className="upload-section">
            <button className="from-tai-khoan" onClick={handleGoloadfile}>
              Từ tài khoản
            </button>{" "}
            {/* Nút In (active) */}
            <button className="upload-btn">
              <label htmlFor="file-upload">Tải lên</label>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </button>
          </div>
          <p className="notif">
            {selectedFile
              ? `File tải lên: ${selectedFile.name}`
              : selectedFileFromList
              ? `File từ tài khoản: ${selectedFileFromList}`
              : "Chưa có file nào"}
          </p>
          {/* Hiển thị nút "Thiết lập trang in" khi có file tải lên */}
          {(selectedFile||selectedFileFromList) && (
              <button className="print-setting-btn" onClick={handleGoToPrintSetting}>
                Thiết lập trang in
              </button>
            )}
          <div className="body">
            <div className="printer-select">
              <label className="chonmayin">Chọn máy in</label>
              <select
                className="option"
                value={printer}
                onChange={handlePrinterChange}
              >
                <option value="">Chọn máy in</option>
                <option value="Printer 1">Printer 1</option>
                <option value="Printer 2">Printer 2</option>
              </select>
            </div>
            <button className="print-btn" onClick={handlePrint}>
              <span>🖨️</span> In
            </button>
            
          </div>
        </div>
        <img src={mayin} alt="mayin" className="mayin" /> {/* mayin */}
      </div>
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
