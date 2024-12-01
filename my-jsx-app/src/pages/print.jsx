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
  const [isUploading, setIsUploading] = useState(false);

  const [printSettings, setPrintSettings] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [printers, setPrinters] = useState([]); // Lưu danh sách máy in từ API
  const [fileDetails, setFileDetails] = useState("");
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
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    
    if (!file) {
      alert("Vui lòng chọn một file để tải lên.");
      return;
    }
  
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
  
    if (!token) {
      alert("Bạn cần đăng nhập để tải lên file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    // Bắt đầu tải file, hiển thị thông báo
    setIsUploading(true);
    

  
    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`, // Gửi token trong header Authorization
        },
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        alert("Tải lên file thành công: " + result.filePath);
  
        // Cập nhật fileDetails với thông tin chi tiết về file
        const fileDetails = {
          name: file.name, // Tên file
          type: file.type, // Loại file
          uploadDate: new Date().toISOString(), // Ngày upload (theo định dạng ISO)
          path: result.filePath, // Đường dẫn file (sẽ nhận từ API)
        };
  
        setFileDetails(fileDetails); // Lưu thông tin vào state
        localStorage.setItem("selectedFile", JSON.stringify(fileDetails)); // Lưu vào localStorage nếu cần
      } else {
        const error = await response.json();
        alert("Lỗi khi tải file lên: " + error.message);
      }
    } catch (error) {
      console.error("Lỗi khi tải file lên:", error);
      alert("Có lỗi xảy ra khi tải file lên.");
    } finally {
      // Kết thúc tải file, ẩn thông báo
      setIsUploading(false);
    }
  };
  
  
  // Hàm xử lý chọn máy in

  const handlePrinterChange = (event) => {
    const selectedPrinter = event.target.value;
    setSelectedPrinter(selectedPrinter);

    // Lưu máy in đã chọn vào localStorage
  };
  // Điều hướng về trang chủ
  const handleGoHome = () => {
    navigate("/"); // Navigate to the homepage
  };
  useEffect(() => {
    // Lấy thông tin từ localStorage
    const settings = localStorage.getItem("printSettings");
    if (settings) {
      setPrintSettings(JSON.parse(settings));
    }
  }, []);
  useEffect(() => {
    const storedFile = localStorage.getItem("selectedFile");
    if (storedFile) {
      setFileDetails(JSON.parse(storedFile)); // Parse dữ liệu từ localStorage
    }
  }, []);
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
  useEffect(() => {
    // Gọi API để lấy danh sách máy in
    const fetchPrinters = async () => {
      try {
        const response = await fetch("http://localhost:5000/printers");
        const data = await response.json();
        setPrinters(data); // Cập nhật danh sách máy in
      } catch (error) {
        console.error("Error fetching printers:", error);
      }
    };
  
    fetchPrinters();
  }, []); // Chỉ chạy một lần khi component mount
  // In file
  const handlePrint = async () => {
    const fileToPrint = selectedFile || fileDetails;
  
    // Kiểm tra nếu không có file hoặc máy in
    if (!fileToPrint || !selectedPrinter) {
      alert("Vui lòng chọn file và máy in.");
      return;
    }
  
    // Kiểm tra và sử dụng dữ liệu mặc định cho printSettings nếu không có trong localStorage
    const defaultPrintSettings = {
      copies: 1,
      orientation: "Portrait",
      pageSize: "A4",
      pageRange: "all",
      customPages: "",
      duplex: "No",
      margin: "Narrow",
      pagesPerSheet: 1,
    };
  
    const settingsToUse = printSettings || defaultPrintSettings;
  
    // Tạo payload để gửi
    const payload = {
      fileDetails: fileDetails||selectedFile, // Thông tin file
      printSettings: settingsToUse, // Thông tin cài đặt in
      printer: selectedPrinter, // Máy in đã chọn
    };
  
    try {
      // Gửi dữ liệu tới server
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/print", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(`In thành công: ${result.message}`);
  
        // Xóa dữ liệu trong localStorage sau khi in xong, ngoại trừ token
        Object.keys(localStorage).forEach((key) => {
          if (key !== "token") {
            localStorage.removeItem(key);
          }
        });
  
        // Cập nhật lại state
        setFileDetails(null);  // Reset file details state
        setPrintSettings(null); // Reset print settings state
        setSelectedFile(null);  // Reset selected file state
        setSelectedPrinter(""); // Reset selected printer state
      } else {
        const error = await response.json();
        alert(`Lỗi khi in: ${error.message}`);
      }
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu in:", err);
      alert("Không thể gửi yêu cầu in. Vui lòng thử lại.");
    }
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
              <div className="upload-notification">
                  {isUploading && <p>Đang tải lên, vui lòng đợi...</p>}
              </div>
              <input
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </button>
          </div>
          <p className="notif">
            {
              fileDetails
              ? `File từ tài khoản: ${fileDetails.name}`
              : "Chưa có file nào"}
          </p>
          {/* Hiển thị nút "Thiết lập trang in" khi có file tải lên */}
          {(fileDetails) && (
              <button className="print-setting-btn" onClick={handleGoToPrintSetting}>
                Thiết lập trang in
              </button>
            )}
          <div className="body">
            <div className="printer-select">
            <label className="chonmayin">Chọn máy in</label>
              <select
                id="printer-select"
                className="option"
                value={selectedPrinter}
                onChange={handlePrinterChange}
              >
                <option value="">Chọn máy in</option>
                {/* Hiển thị danh sách máy in từ API */}
                {printers.map((printer) => (
                  <option key={printer.printer_ID} value={printer.printer_ID}>
                    {printer.brand} {printer.model} ({printer.location})
                  </option>
                ))}
              </select>
              {selectedPrinter && (
                <p>
                  Bạn đã chọn máy in với ID: <strong>{selectedPrinter}</strong>
                </p>)}
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
