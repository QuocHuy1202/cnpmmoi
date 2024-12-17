import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import image from "../image/image.png";
import avar from "../image/avar.svg";
import "../css/printhistory.css";
import "../css/historyspso.css";
import { toast, ToastContainer } from "react-toastify";
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
  const [printHistory, setPrintHistory] = useState([]); // Store print history
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Fetch printers and students data from API
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5001/api/printers/printers")
      .then(response => {
        setPrinters(response.data);
      })
      .catch(error => {
        console.error("Error fetching printers:", error);
      });

      axios.get("http://localhost:5001/api/account/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setStudents(response.data);
        })
        .catch(error => {
          console.error("Error fetching students:", error);
        });
      
      axios.get("http://localhost:5001/api/history/print-history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setPrintHistory(response.data);
        })
        .catch(error => {
          console.error("Error fetching history:", error);
        });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleAvatarPopup = () => {
    setIsAvatarPopupOpen(!isAvatarPopupOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleResize = () => setIsMobileView(window.innerWidth <= 768);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handlePrinterChange = (e) => {
    const printerId = e.target.value;
    setSelectedPrinter(printerId);
    
    
  };

  
  const searching = () => {
    const token = localStorage.getItem("token"); 

if (selectedPrinter && mssv) {
  axios
    .get(`http://localhost:5001/api/history/print-history?printerId=${selectedPrinter}&mssv=${mssv}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setPrintHistory(response.data); // Set print history for selected printer
    })
    .catch((error) => {
      console.error("Error fetching print history:", error);
    });
} else if (selectedPrinter) {
  axios
    .get(`http://localhost:5001/api/history/print-history?printerId=${selectedPrinter}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setPrintHistory(response.data); // Set print history for selected printer
    })
    .catch((error) => {
      console.error("Error fetching print history for printer:", error);
    });
} else if (mssv) {
  axios
    .get(`http://localhost:5001/api/history/print-history?mssv=${mssv}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.data && response.data.length > 0) {
        // If print history is found, update the state
        setPrintHistory(response.data);
      } else {
        // If no print history found, show an alert
        setPrintHistory([]); // Clear any existing print history
        toast.error("Không tìm thấy lịch sử in");
      }
    })
    .catch((error) => {
      // Handle any error (e.g., network error)
      setPrintHistory([]); // Clear any existing print history
      toast.error("Không tìm thấy lịch sử in");
    });
} else {
  axios
    .get(`http://localhost:5001/api/history/print-history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setPrintHistory(response.data); // Set print history for all printers
    })
    .catch((error) => {
      console.error("Error fetching print history:", error);
    });
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
              <Link to="/spso" className="trangchuls">Trang chủ</Link>
              <Link to="/managerprint" className="quanlils">Quản lí máy in</Link>
              <Link to="/adjust" className="dieuchinhls">Điều chỉnh</Link>
              <Link to="/historyspso" className="xemls">Xem lịch sử in</Link>
            </nav>
          )}
        </nav>
        {isLoggedIn ? (
          <div className="avatar-link" onClick={toggleAvatarPopup}>
            <img src={avar} alt="Avatar" className="hAnh" />
          </div>
        ) : (
          <Link to="/login" className="dangnhap">Đăng nhập</Link>
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
        <h1>Tìm kiếm theo máy in và MSSV</h1>
        <div className="option">
          {/* Printer selection */}
          <div className="printer-selection">
            <h2>Chọn máy in</h2>
            <select value={selectedPrinter} onChange={handlePrinterChange}>
              <option value="">Tất cả máy in</option>
              {printers.map((printer) => (
                <option key={printer.printer_ID} value={printer.printer_ID}>{printer.model}</option>
              ))}
            </select>
          </div>

          {/* Display printer details */}

          {/* Search student */}
          <div className="student-search">
            <h2>MSSV</h2>
            <input
              type="text"
              placeholder="Nhập MSSV"
              value={mssv}
              onChange={(e) => setMssv(e.target.value)}
            />
            <button onClick={searching}>Tìm kiếm</button>
          </div>

          {/* Display student details */}
          {printHistory.length > 0 && (
            <div className="student-details">
              <h2>Lịch sử in ấn</h2>
              <table className="details-table">
                <thead>
                  <tr>
                    <th>MSSV</th>
                    <th>email</th>
                    <th>Tên file</th>
                    <th>Số lượng in</th>
            
                    <th>Ngày tháng in</th>
                  </tr>
                </thead>
                <tbody>
                  {printHistory.map((detail, index) => (
                    <tr key={index}>
                      <td>{detail.student_id}</td>
                      <td>{detail.account_email}</td>
                      <td>{detail.printed_file}</td>
                      <td>{detail.settings ? JSON.parse(detail.settings).copies : "N/A"}</td>


                      <td>{detail.printed_time}</td>
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
            <Link to="/spso" onClick={togglePopup}><li>Trang Chủ</li></Link>
            <Link to="/managerprint" onClick={togglePopup}><li>Quản lí máy in</li></Link>
            <Link to="/adjust" onClick={togglePopup}><li>Điều Chỉnh</li></Link>
            <Link to="/historyspso" onClick={togglePopup}><li>Xem lịch sử in</li></Link>
          </ul>
        </div>
      )}
    </div>
  );
};
