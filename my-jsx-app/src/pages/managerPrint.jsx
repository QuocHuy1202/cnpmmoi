import React, { useState, useEffect } from "react";
import "../css/managerPrint.css";
import { Link, useNavigate } from "react-router-dom";
import avar from "../image/avar.svg";
import image from "../image/image.png";

export const ManagerPrint = () => {
  const navigate = useNavigate();
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [printers, setPrinters] = useState([
    {
      id: 1,
      name: "Printer A",
      location: "Office 1",
      status: "Trạng thái: Đang Tắt",
    },
    {
      id: 2,
      name: "Printer B",
      location: "Office 2",
      status: "Trạng thái: Đang Bật",
    },
  ]);
  const [selectedPrinters, setSelectedPrinters] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleLogout = () => {
    localStorage.clear(); // Xóa tất cả các mục trong localStorage

    // Remove token from localStorage
    setIsLoggedIn(false); // Update the logged-in status
    navigate("/login"); // Redirect user to the login page
  };
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenuPopup = () => {
    setIsMenuPopupOpen(!isMenuPopupOpen);
  };

  const toggleAvatarPopup = () => {
    setIsAvatarPopupOpen(!isAvatarPopupOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPrinter = {
      id: Date.now(),
      name,
      location,
      status: "Trạng thái: Đang Tắt",
    };
    setPrinters([...printers, newPrinter]);
    setName("");
    setLocation("");
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const togglePrinterStatus = (id) => {
    setPrinters((prevPrinters) =>
      prevPrinters.map((printer) =>
        printer.id === id
          ? {
              ...printer,
              status:
                printer.status === "Trạng thái: Đang Bật"
                  ? "Trạng thái: Đang Tắt"
                  : "Trạng thái: Đang Bật",
            }
          : printer
      )
    );
  };

  const handleSelectPrinter = (id) => {
    setSelectedPrinters((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((printerId) => printerId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeletePrinters = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setPrinters((prevPrinters) =>
      prevPrinters.filter((printer) => !selectedPrinters.includes(printer.id))
    );
    setSelectedPrinters([]);
    setShowDeleteModal(false);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="manager-print-container">
      {/* Header Section */}
      {showSuccessMessage && (
        <div className="success-message">Máy in đã được thêm thành công!</div>
      )}
      <header className="header">
        <img src={image} alt="Logo" className="logo" />
        <nav className="navbar">
          {isMobileView ? (
            <button className="menu-button" onClick={toggleMenuPopup}>
              ☰
            </button>
          ) : (
            <nav className="navbar">
              <Link to="/spso" className="trangchump">
                Trang chủ
              </Link>
              <Link to="/managerprint" className="quanlimp">
                Quản lí máy in
              </Link>
              <Link to="/adjust" className="dieuchinhmp">
                Điều chỉnh
              </Link>
              <Link to="/historyspso" className="xemmp">
                Xem lịch sử in
              </Link>
            </nav>
          )}
        </nav>

        {/* Avatar or Login link */}
        {isLoggedIn ? (
          <div className="avatar-link" onClick={toggleAvatarPopup}>
            <img src={avar} alt="Avatar" className="hAnh" />
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
      {/* Printer Addition Form */}
      <form className="add-printer-form" onSubmit={handleSubmit}>
        <h2>Add New Printer</h2>
        <div className="form-group">
          <label>Printer Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="add-printer-button">
          Thêm máy in
        </button>
      </form>

      {/* Printer List */}
      <div className="printer-list">
        <h2>Printers List</h2>
        {printers.length === 0 ? (
          <p>No printers added yet.</p>
        ) : (
          <ul>
            {printers.map((printer) => (
              <li key={printer.id} className="printer-item">
                <input
                  type="checkbox"
                  checked={selectedPrinters.includes(printer.id)}
                  onChange={() => handleSelectPrinter(printer.id)}
                />
                <strong>{printer.name}</strong> - {printer.location} (
                {printer.status})
                <button
                  className={`toggle-status-button ${
                    printer.status === "Trạng thái: Đang Bật"
                      ? "inactive"
                      : "active"
                  }`}
                  onClick={() => togglePrinterStatus(printer.id)}
                >
                  {printer.status === "Trạng thái: Đang Bật" ? "Tắt" : "Bật"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* xoá */}
      {selectedPrinters.length > 0 && (
        <div className="delete-printers-container">
          <button
            onClick={handleDeletePrinters}
            className="delete-printers-button"
          >
            Delete Selected Printers
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <h3>Are you sure you want to delete the selected printers?</h3>
            <div className="modal-buttons">
              <button onClick={confirmDelete} className="confirm-delete-button">
                Yes
              </button>
              <button onClick={cancelDelete} className="cancel-delete-button">
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Popup Menu cho thiết bị di động */}
      {isMenuPopupOpen && isMobileView && (
        <div className="popup">
          <ul>
            <Link to="/spso" onClick={toggleMenuPopup}>
              <li>Trang Chủ</li>
            </Link>
            <Link to="/managerprint" onClick={toggleMenuPopup}>
              <li>Quản lí máy in</li>
            </Link>
            <Link to="/adjust" onClick={toggleMenuPopup}>
              <li>Điều chỉnh</li>
            </Link>
            <Link to="/historyspso" onClick={toggleMenuPopup}>
              <li>Xem lịch sử</li>
            </Link>
          </ul>
        </div>
      )}
    </div>
  );
};
