import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from "../image/image.png";
import avar from "../image/avar.svg";
import "../css/printhistory.css";
import "../css/historyspso.css";

export const HistorySPSO = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [mssv, setMssv] = useState("");
  const [printers, setPrinters] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [studentDetails, setStudentDetails] = useState([]);
  const [printerDetails, setPrinterDetails] = useState([]);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false); // Popup for avatar
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Hook to navigate user

  // bảng ví dụ select lại cho phù hợp
  const samplePrinters = [
    { id: "tất cả", name: "tất cả máy in" },
    { id: "printer1", name: "Printer 1" },
    { id: "printer2", name: "Printer 2" },
  ];

  const sampleStudents = [
    { id: "2213732", name: "Student 1" },
    { id: "2212345", name: "Student 2" },
  ];

  const samplePrinterDetails = [
    {
      fileName: "file1.pdf",
      printQuantity: 10,
      fileFormat: "PDF",
      printDate: "2023-10-01",
    },
    {
      fileName: "file2.docx",
      printQuantity: 5,
      fileFormat: "DOCX",
      printDate: "2023-10-02",
    },
  ];

  const sampleStudentDetails = [
    {
      fileName: "file1.pdf",
      printQuantity: 10,
      fileFormat: "PDF",
      printDate: "2023-10-01",
    },
    {
      fileName: "file2.docx",
      printQuantity: 5,
      fileFormat: "DOCX",
      printDate: "2023-10-02",
    },
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
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // useEffect(() => {
  //   const fetchPrinters = async () => {
  //     try {
  //       const response = await fetch("http://localhost:5001/api/spsoprinter");
  //       if (response.ok) {
  //         const data = await response.json();
  //         setPrinters(data); 
  //       } else {
  //         console.error("Lỗi khi lấy danh sách máy in:", response.statusText);
  //       }
  //     } catch (error) {
  //       console.error("Lỗi khi gọi API máy in:", error);
  //     }
  //   };

  //   fetchPrinters();
  // }, []);

  useEffect(() => {
    // Lấy danh sách máy in khi khởi tạo component
    const fetchPrinters = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/spsoprinter");
        if (response.ok) {
          const data = await response.json();
          setPrinters(data); 
        } else {
          console.error("Lỗi khi lấy danh sách máy in:", response.statusText);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API máy in:", error);
      }
    };
  
    fetchPrinters();
  }, []); // Chạy một lần khi component được mount
  

  useEffect(() => {
    const fetchPrinterDetails = async (printerId) => {
      try {
        const response = await fetch("http://localhost:5001/api/detailprinter");
        if (response.ok) {
          const data = await response.json();
          
          // Lọc dữ liệu theo Printer_ID nếu có selectedPrinter
          const filteredData = printerId 
            ? data.filter(item => item.printer_ID === Number(printerId)) 
            : data;
  
          setPrinterDetails(filteredData); // Cập nhật danh sách chi tiết
          console.log("Lịch sử in:", filteredData);
        } else {
          console.error("Lỗi khi gọi API detailprinter:", response.statusText);
          setPrinterDetails([]);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API detailprinter:", error);
        setPrinterDetails([]);
      }
    };
  
    // Gọi API nếu có selectedPrinter
    if (selectedPrinter) {
      fetchPrinterDetails(selectedPrinter);
    } else {
      setPrinterDetails([]); // Reset khi không có máy in được chọn
    }
  }, [selectedPrinter]); // Theo dõi `selectedPrinter`
  

  
  
  const handlePrinterChange = (e) => {
    const printerId = e.target.value; // Lấy giá trị từ dropdown
    setSelectedPrinter(printerId && printerId !== "tất cả" ? printerId : null); // Xử lý logic chọn "tất cả"
  };

  

  const handleSearchStudent = async () => {
    try {
      // Gọi API lấy dữ liệu từ bảng `detailprinter`
      const response = await fetch("http://localhost:5001/api/detailprinter");
      if (response.ok) {
        const data = await response.json();
  
        // Tìm dữ liệu liên quan đến MSSV nhập vào
        const studentDetails = data.filter((item) => item.student_ID.toString() === mssv);
  
        if (studentDetails.length > 0) {
          setSelectedStudent(mssv); // Cập nhật MSSV đang chọn
          setStudentDetails(studentDetails); // Cập nhật lịch sử in của sinh viên
        } else {
          alert("Không tìm thấy dữ liệu cho MSSV này!");
          setSelectedStudent(null);
          setStudentDetails([]);
        }
      } else {
        console.error("Lỗi khi gọi API detailprinter:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API detailprinter:", error);
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
        <h1>Quản lý máy in và sinh viên</h1>
        <div className="option">
          {/* Chọn máy in */}
          <div className="printer-selection">
            <h2>Chọn máy in</h2>
            <select value={selectedPrinter} onChange={handlePrinterChange}>
              <option value="">Chọn máy in</option>
              {printers.map((printer) => (
                <option key={printer.printer_ID} value={printer.printer_ID}>
                  {printer.brand} - {printer.model}
                </option>
              ))}
            </select>
          </div>

          {/* Hiển thị thông tin máy in */}
          {selectedPrinter && printerDetails.length > 0 && (
  <div className="printer-details">
    <h2>Thông tin Máy in</h2>
    <table className="details-table">
      <thead>
        <tr>
          <th>Tên file</th>
          <th>Số lượng in</th>
          <th>Định dạng file</th>
          <th>Ngày tháng in</th>
        </tr>
      </thead>
      <tbody>
        {printerDetails.map((detail, index) => (
          <tr key={index}>
            <td>{detail.file_name}</td>
            <td>{detail.number_of_pages}</td>
            <td>{detail.file_type}</td>
            <td>{detail.print_time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

          {/* Tìm kiếm sinh viên */}
          <div className="student-search">
            <h2>Tìm kiếm sinh viên theo MSSV</h2>
            <input
              type="text"
              placeholder="Nhập MSSV"
              value={mssv}
              onChange={(e) => setMssv(e.target.value)}
            />
            <button onClick={handleSearchStudent}>Tìm kiếm</button>
          </div>

          {/*!  Hiển thị thông tin sinh viên */}
          {studentDetails.length > 0 && (
            <div className="student-details">
              <h2>Thông tin Sinh viên</h2>
              <table className="details-table">
                <thead>
                  <tr>
                    <th>MSSV</th> {/* Cột MSSV */}
                    <th>Tên Sinh viên</th> {/* Cột Tên sinh viên */} 
                    <th>Tên file</th>
                    <th>Số lượng in</th>
                    <th>Định dạng file</th>
                    <th>Ngày tháng in</th>
                  </tr>
                </thead>
                <tbody>
                  {studentDetails.map((detail, index) => (
                    <tr key={index}>
                      <td>{mssv}</td>
                      <td>
                        {students.find((student) => student.student_ID === mssv)?.name}
                      </td>{" "}
                      <td>{detail.file_name}</td>
                      <td>{detail.number_of_pages}</td>
                      <td>{detail.file_type}</td>
                      <td>{detail.print_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
