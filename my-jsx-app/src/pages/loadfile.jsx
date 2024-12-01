import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from "../image/image.png";
import avar from "../image/avar.svg";
import "../css/loadfile.css";

export const TaiFile = () => {
  // State lưu danh sách file đã tải lên
  const [files, setFiles] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false); // Popup for avatar
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Hook to navigate user
  // State lưu file được chọn tạm thời
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileFromList, setSelectedFileFromList] = useState(""); // Tên file được chọn từ danh sách
  const handleGoPrint = () => {
    navigate("/print", { state: { selectedFileFromList } }); // Chuyển sang trang Print với state
  };
  // const handleGoPrint = () => {
  //   window.close(); // Đóng cửa sổ/tab hiện tại
  // };
  // Hàm xử lý khi chọn file
  const toggleAvatarPopup = () => {
    setIsAvatarPopupOpen(!isAvatarPopupOpen); // Toggle avatar popup
  };
  const handleLogout = () => {
    localStorage.clear(); // Xóa tất cả các mục trong localStorage

    // Remove token from localStorage
    setIsLoggedIn(false); // Update the logged-in status
    navigate("/login"); // Redirect user to the login page
  };
  const handleSelectFileFromList = (fileName) => {
    const selectedFile = files.find((file) => file.name === fileName);
    if (selectedFile) {
      localStorage.setItem("selectedFile", JSON.stringify(selectedFile)); // Lưu thông tin file vào localStorage
      setSelectedFileFromList(fileName); // Lưu tên file
    }
  };
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set login status based on token existence
  }, []);
  useEffect(() => {
    // Gọi handleGoPrint ngay sau khi selectedFileFromList thay đổi
    if (selectedFileFromList) {
      handleGoPrint(); // Gọi handleGoPrint ngay lập tức
    }
  }, [selectedFileFromList]); // chuyển trang khi chọn

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/files", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Đặt token ở đây
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }

        const data = await response.json();
        console.log(data);
        setFiles(
          data.files.map((file) => ({
            name: file.file_name,
            type: file.file_type,
            date: file.uploaded_at,
            path: file.file_path, // Thêm đường dẫn để có thể tải về hoặc hiển thị
          }))
        );
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div className="app">
      {/* Header chứa logo và thanh điều hướng */}
      <header className="header">
        <img src={image} alt="Logo" className="logo" />
        <nav className="navbar">
          {isMobileView ? (
            <button className="menu-button" onClick={togglePopup}>
              ☰
            </button>
          ) : (
            <nav className="navbar">
              <Link to="/" className="trangchu-bot">
                Trang chủ
              </Link>
              <Link to="/print" className="in-bot active">
                In
              </Link>
              <Link to="/history" className="xem-bot">
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
        {/* avarta */}
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
      {/* Nội dung */}
      <div className="contentlf">
        {/* Danh sách file, này phải có database nên thêm vài cái demo */}
        <div className="list-file">
          <label className="list-label">Danh sách file</label>
          <table className="file-table">
            <thead>
              <tr>
                <th>Tên file</th>
                <th>Loại file</th>
                <th>Ngày tải</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => (
                <tr key={index}>
                  <td>{file.name}</td>
                  <td>{file.size}</td>
                  <td>{file.date}</td>
                  <td>
                    <button
                      onClick={() => handleSelectFileFromList(file.name)}
                      className="select-btn"
                    >
                      Chọn
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className="btn cancel" onClick={handleGoPrint}>
          Thoát
        </button>
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
