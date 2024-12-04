import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import image from "../image/image.png";
import avar from "../image/avar.svg";
import "../css/printhistory.css";
import "../css/adjust.css";

export const AdjustPrint = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [students, setStudents] = useState([]);
  const [allowedFormats, setAllowedFormats] = useState([]);
  const [addAllowedFormats, setAddAllowedFormats] = useState("");
  const [error, setError] = useState(null);
  const [Time, setTime] = useState("");
  const [studentIdInput, setStudentIdInput] = useState("");
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false); // Popup for avatar
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentProvideDate, setCurrentProvideDate] = useState("");
  const [currentDefaultPages, setCurrentDefaultPages] = useState("");
  const [currentPrintLimit, setCurrentPrintLimit] = useState("");
  const [providePagesDate, setProvidePagesDate] = useState('');
  const [defaultPages, setDefaultPages] = useState(0);
  const [printLimit, setPrintLimit] = useState(0);
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
    // Gọi API để lấy dữ liệu
    const fetchAllowedFiles = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/adjust/allowed-files');
  
        // Kiểm tra xem phản hồi có thành công hay không
        if (!response.ok) {
          throw new Error('Lỗi khi lấy dữ liệu từ server');
        }
  
        // Chuyển dữ liệu thành JSON
        const data = await response.json();
        setAllowedFormats(data);
      } catch (err) {
        setError('Lỗi khi lấy dữ liệu từ server');
        console.error(err);
      }
    };
  
    fetchAllowedFiles();
  }, []);

  useEffect(() => {
    // Gọi API để lấy currentProvideDate từ server
    const fetchCurrentProvideDate = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/adjust/current-status');
        const data = await response.json();
        
        if (data.currentProvideDate && data.currentDefaultPages && data.currentPrintLimit) {
          const formattedDate = data.currentProvideDate.slice(0, 16); // Chuyển đổi sang chuỗi datetime-local (YYYY-MM-DDTHH:mm)
          setCurrentProvideDate(formattedDate);
          setCurrentDefaultPages(data.currentDefaultPages);
          setCurrentPrintLimit(data.currentPrintLimit);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchCurrentProvideDate(); // Gọi API khi component được render
  }, []);

  useEffect(() => {
    // Use sample data instead of fetching from API
    setStudents(sampleStudents);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const deleteAllowedFile = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/adjust/delete-file/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Xóa record khỏi state
        setAllowedFormats(allowedFormats.filter((item) => item.ID !== id));
      } else {
        console.error('Không thể xóa loại file');
      }
    } catch (err) {
      console.error('Lỗi khi xóa loại file:', err);
    }
  };

  const addFileFormat = async () => {
    const trimmedFormat = addAllowedFormats.trim().toUpperCase();

  // Kiểm tra nếu input trống
  if (trimmedFormat === "") {
    setError("Định dạng file không thể để trống.");
    return;
  }

  // Kiểm tra nếu định dạng đã tồn tại trong allowedFormats
  if (allowedFormats.some(format => format.file_type_allowed.toUpperCase() === trimmedFormat)) {
    setError("Định dạng file đã tồn tại.");
    return;
  }

    try {
      // Gửi yêu cầu POST lên backend
      const response = await fetch('http://localhost:5001/api/adjust/add-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_type_allowed: addAllowedFormats.trim().toUpperCase(),
        }),
      });

      if (response.ok) {
        const newFormat = await response.json();
        setAllowedFormats([...allowedFormats, newFormat.file_type_allowed]);
        setAddAllowedFormats(""); // Reset input
        setError(""); // Xóa lỗi
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Có lỗi xảy ra khi thêm loại file.");
      }
    } catch (error) {
      console.error("Lỗi khi kết nối đến server:", error);
      setError("Lỗi khi kết nối đến server.");
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/adjust/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provide_pages_date: providePagesDate,
          standard_pages_provide: defaultPages, 
          limit_copy_per_print: printLimit, 
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Dữ liệu đã được lưu thành công:', result);
        console.log('Dữ liệu đã được lưu thành công:', result);
      } else {
        console.error('Lỗi khi lưu dữ liệu:', result.message);
      }
    } catch (error) {
      console.error('Lỗi kết nối tới server:', error);
    }
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handlePrintLimitChange = (e) => {
    setPrintLimit(e.target.value);
  };

  const handleDateChange = (e) => {
    setProvidePagesDate(e.target.value);
  };

  const handleDefaultPagesChange = (e) => {
    setDefaultPages(e.target.value);
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
        <div className="adjust-section2">
          <h2>Chọn thời gian cấp giấy</h2>
          <div className="time-range">
            {/* Calendar box để chọn thời gian bắt đầu */}
            <label>
              <input
                type="datetime-local"
                value={Time.start}
                onChange={handleDateChange}
              />
            </label>

            {/* Calendar box thứ hai để hiển thị ngày cấp hiện tại */}
            <label>
              <input
                type="datetime-local"
                value={currentProvideDate}
                readOnly
                disabled
              />
            </label>
          </div>
        </div>
          <div className="page-defailt">
            <h2>Chỉnh sửa số trang in mặc định</h2>
            
            <input
              type="number"
              value={defaultPages}
              onChange={handleDefaultPagesChange}
            />
            <input
              type="number"
              value={currentDefaultPages}
              readOnly
              disabled
            />
            
          </div>
          <div className="adjust-section2">
            <h2>Đặt giới hạn về số lượng bản in cho 1 lần in</h2>
            <input
              type="number"
              value={printLimit}
              onChange={handlePrintLimitChange}
            />
            <input
              type="number"
              value={currentPrintLimit}
              readOnly
              disabled
            />
          </div>
          <div className="adjust-section1">
            <h2>Kiểm soát các định dạng file cho phép in</h2>
            {/* Input để nhập định dạng file */}
            <div className="add-format">
              <input
                type="text"
                placeholder="Nhập định dạng file (VD: PDF, DOCX)"
                value={addAllowedFormats}
                onChange={(e) => setAddAllowedFormats(e.target.value)} // Cập nhật giá trị nhập
              />
              <button onClick={addFileFormat}>Thêm</button>
            
            </div>

            {/* Khung hiển thị danh sách định dạng file */}
            <div className="allowed-formats-list">
              {allowedFormats.length > 0 ? (
                allowedFormats.map((format, index) => (
                  <div key={index} className="format-item">
                    {/* Hiển thị tên định dạng file */}
                    <span>{format.file_type_allowed}</span> {/* Sử dụng file_type_allowed để hiển thị tên định dạng */}

                    <button
                      onClick={() =>
                        deleteAllowedFile(format.ID)
                      }
                    >
                      Xóa
                    </button>
                  </div>
                ))
              ) : (
                <p>Không có định dạng file nào được cho phép.</p>
              )}
            </div>

          </div>

          <button
            onClick={handleSubmit}
          >
            Áp dụng cho tất cả sinh viên
          </button>
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
