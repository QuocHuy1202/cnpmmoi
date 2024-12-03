import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from "../image/image.png";
import avar from "../image/avar.svg";
import "../css/printhistory.css";
import "../css/historyspso.css";

export const HistorySPSO = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [historyData, setHistoryData] = useState([]);
  const [printers, setPrinters] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [printDetails, setPrintDetails] = useState([]);
  const [studentPrintDetails, setStudentPrintDetails] = useState([]);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false); // Popup for avatar
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Hook to navigate user

  // Sample data for testing

  const samplePrinters = [
    { id: "printer1", name: "Printer 1" },
    { id: "printer2", name: "Printer 2" },
  ];

  const sampleStudents = [
    { id: "2234567", name: "Student 1" },
    { id: "2234568", name: "Student 2" },
  ];

  const sampleHistoryData = [
    {
      id: 1,
      date: "2023-10-01",
      username: "Student 1",
      pageCount: 10,
      status: "Completed",
    },
    {
      id: 2,
      date: "2023-10-02",
      username: "Student 2",
      pageCount: 5,
      status: "Completed",
    },
  ];

  const samplePrintDetails = [
    { fileName: "file1.pdf", printQuantity: 10, fileFormat: "PDF" },
    { fileName: "file2.docx", printQuantity: 5, fileFormat: "DOCX" },
  ];

  const sampleStudentPrintDetails = [
    { id: "2234567", name: "Student 1", printQuantity: 10 },
    { id: "2234568", name: "Student 2", printQuantity: 5 },
  ];
  const toggleAvatarPopup = () => {
    setIsAvatarPopupOpen(!isAvatarPopupOpen); // Toggle avatar popup
  };
  const handleLogout = () => {
    localStorage.clear(); // Xóa tất cả các mục trong localStorage
    setIsLoggedIn(false); // Update the logged-in status
    navigate("/login"); // Redirect user to the login page
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set login status based on token existence
  }, []);
  useEffect(() => {
    // Use sample data instead of fetching from API
    setPrinters(samplePrinters);
  }, []);

  useEffect(() => {
    if (selectedPrinter) {
      // Use sample data instead of fetching from API
      setStudents(sampleStudents);
      setStudentPrintDetails(sampleStudentPrintDetails);
    }
  }, [selectedPrinter]);

  useEffect(() => {
    if (selectedPrinter && selectedStudent) {
      // Use sample data instead of fetching from API
      setHistoryData(sampleHistoryData);
    }
  }, [selectedPrinter, selectedStudent]);

  useEffect(() => {
    if (selectedStudent) {
      // Use sample data instead of fetching from API
      setPrintDetails(samplePrintDetails);
    }
  }, [selectedStudent]);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleStudentChange = (e) => {
    const value = e.target.value;
    if (value === "allstudent") {
      setSelectedStudent("");
    } else {
      setSelectedStudent(value);
    }
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
              <Link to="/spso" className="trangchuls">
                Trang chủ
              </Link>
              <Link to="/managerprint" className="quanlils">
                Quản lí máy in
              </Link>
              <Link to="/adjust" className="dieuchinhls">
                Điều chỉnh
              </Link>
              <Link to="/historyspso" className="xemls">
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
      <div className="history-content">
        <h1>Lịch sử in ấn</h1>
        <div className="filters">
          <select
            value={selectedPrinter}
            onChange={(e) => setSelectedPrinter(e.target.value)}
          >
            <option value="">Chọn máy in</option>
            {printers.map((printer) => (
              <option key={printer.id} value={printer.id}>
                {printer.name}
              </option>
            ))}
          </select>
          {selectedPrinter && (
            <select value={selectedStudent} onChange={handleStudentChange}>
              <option value="allstudent">Tất cả sinh viên</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          )}
        </div>
        {selectedPrinter &&
          !selectedStudent &&
          studentPrintDetails.length > 0 && (
            <div className="student-print-details">
              <h2>Chi tiết in của Máy in</h2>
              <table className="details-table">
                <thead>
                  <tr>
                    <th>MSSV</th>
                    <th>Tên</th>
                    <th>Số lượng bản in</th>
                  </tr>
                </thead>
                <tbody>
                  {studentPrintDetails.map((detail) => (
                    <tr key={detail.id}>
                      <td>{detail.id}</td>
                      <td>{detail.name}</td>
                      <td>{detail.printQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        {selectedStudent && printDetails.length > 0 && (
          <div className="print-details">
            <h2>Chi tiết in của Sinh viên</h2>
            <table className="details-table">
              <thead>
                <tr>
                  <th>Tên file</th>
                  <th>Số lượng in</th>
                  <th>Định dạng file</th>
                </tr>
              </thead>
              <tbody>
                {printDetails.map((detail) => (
                  <tr key={detail.fileName}>
                    <td>{detail.fileName}</td>
                    <td>{detail.printQuantity}</td>
                    <td>{detail.fileFormat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
              <li>Điều Chỉnh</li>
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
