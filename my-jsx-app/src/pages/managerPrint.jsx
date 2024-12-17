import React, { useState, useEffect } from "react";
import "../css/managerPrint.css";
import { Link, useNavigate } from "react-router-dom";
import avar from "../image/avar.svg";
import image from "../image/image.png";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:5001";

export const ManagerPrint = () => {
  const navigate = useNavigate();
  const [isMenuPopupOpen, setIsMenuPopupOpen] = useState(false);
  const [isAvatarPopupOpen, setIsAvatarPopupOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [brand, setBrand] = useState(""); // New
  const [model, setModel] = useState(""); // New
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Offline"); // Default status
  const samplePrinters = [
    {
      ID: 1,
      brand: "Brand1",
      model: "Model1",
      location: "Office 1",
      status: "Offline",
    },
    {
      ID: 2,
      brand: "Brand2",
      model: "Model2",
      location: "Office 2",
      status: "Online",
    },
  ];
  const [printers, setPrinters] = useState([]);
  const getPrinters = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/printers/printers`);
      if (!response.ok) {
        // throw new Error('Lỗi khi lấy dữ liệu từ server');
        const errorData = await response.json();
        const errorMessage = errorData.message || "Fetch Printers failed!";
        toast.error(errorMessage); // Show error message with toast
      }
      // Successful login
      const data = await response.json();
      //console.log(data);
      return data;
      
    } catch (error) {
      //console.error("Error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  }
  useEffect(() => {
    const fetchPrinters = async () => {
      const fetchedPrinters = await getPrinters();
      //console.log(fetchPrinters);
      setPrinters(fetchedPrinters);
    };
    fetchPrinters();
  }, []);

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

  const addPrinter = async () => {
    try {
      // Gửi yêu cầu POST lên backend
      const response = await fetch(`${backendUrl}/api/printers/addPrinter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand: brand,
          model: model,
          location: location,
          status: status,
        }),
      });
      if (!response.ok) {
        // throw new Error('Lỗi khi lấy dữ liệu từ server');
        const errorData = await response.json();
        const errorMessage = errorData.message || "Fetch Printers failed!";
        toast.error(errorMessage); // Show error message with toast
      }
      const data = await response.json();
      return data;
    } catch (error) {
      //console.error("Lỗi khi thêm máy in", error);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await addPrinter();
    setPrinters(response);
    setBrand(""); // Reset
    setModel(""); // Reset
    setLocation("");
    setStatus("Offline"); // Default
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const togglePrinterStatus = async (ID) => {
    
   // Giả sử bạn muốn tìm máy in có printer_ID là 3



    // Find the printer with the specified ID
    const printer = printers.find((printer) => printer.printer_ID === ID);

  
    if (!printer) {
      return;
      //console.error(`Printer with ID ${ID} not found.`);
      
    }
  
    const newStatus = printer.status === "Online" ? "Offline" : "Online";
  
    // Update the state
    setPrinters((prevPrinters) =>
      prevPrinters.map((printer) =>
        printer.printer_ID === ID
          ? { ...printer, status: newStatus }
          : printer
      )
    );
  
    try {
      //console.log(`Updating status to ${newStatus} for printer ID: ${ID}`);
      const response = await fetch('http://localhost:5001/api/printers/updateStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID: ID,
          status: newStatus, // Send the new status
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update printer status');
      }
  
      const data = await response.json();
      //console.log('Printer status updated successfully:', data);
    } catch (error) {
      //console.error('Error updating printer status:', error);
    }
  };
  

  const handleSelectPrinter = (ID) => {
    setSelectedPrinters((prevSelected) => {
      const updatedSelected = prevSelected.includes(ID)
        ? prevSelected.filter((printerID) => printerID !== ID)
        : [...prevSelected, ID];
      //console.log("Updated Selected Printers:", updatedSelected);
      return updatedSelected;
    });
  };
  
  const handleDeletePrinters = () => {
    setShowDeleteModal(true);
  };

  const deletePrinter = async (delete_printers) => {
    try {
      const response = await fetch(`${backendUrl}/api/printers/deletePrinter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          delete: delete_printers
        }),
      });
      
      return response;
    } catch (err) {
      //console.error('Lỗi khi xóa loại file:', err);
    }
  };

  const confirmDelete = async () => {
    // DELETE IN DATABASE
    const response = await deletePrinter(selectedPrinters);
    setPrinters((prevPrinters) =>
      prevPrinters.filter((printer) => !selectedPrinters.includes(printer.ID))
    );
    if (response.ok) {
      //console.log("DELETION SUCCESS");
      setSelectedPrinters([]);
      setShowDeleteModal(false);
    } else {
      //console.error('Không thể xóa loại file');
    }
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
          <label>Brand:</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Model:</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
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
        
        <div className="form-group">
          <label>Status:</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Offline">Offline</option>
            <option value="Online">Online</option>
          </select>
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
              <li key={printer.ID} className="printer-item">
                <input
                  type="checkbox"
                  checked={selectedPrinters.includes(printer.printer_ID)}
                  onChange={() => handleSelectPrinter(printer.printer_ID)}
                />
                <div className="printer-details">
                  <p><strong>Brand:</strong> {printer.brand}</p>
                  <p><strong>Model:</strong> {printer.model}</p>
                  <p><strong>Location:</strong> {printer.location}</p>
                  <p><strong>Status:</strong> {printer.status}</p>
                </div>
                <button
                  className={`toggle-status-button ${
                    printer.status === "Online"
                      ? "inactive"
                      : "active"
                  }`}
                  onClick={() => togglePrinterStatus(printer.printer_ID)}
                >
                  {printer.status === "Online" ? "Tắt" : "Bật"}
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
