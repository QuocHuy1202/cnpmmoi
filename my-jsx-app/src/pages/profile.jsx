import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useHistory để điều hướng
import "../css/profile.css";

export const Profile = () => {
  const [status, setStatus] = useState("");
  const [numberOfPagesRemaining, setNumberOfPagesRemaining] = useState(0);

  const navigate = useNavigate(); // Khởi tạo hook useHistory

  // Load thông tin từ localStorage khi component load
  useEffect(() => {
    const statusFromStorage = localStorage.getItem("status");
    const pagesRemainingFromStorage = localStorage.getItem("number_of_pages_remaining");

    if (statusFromStorage) {
      setStatus(statusFromStorage);
    }

    if (pagesRemainingFromStorage) {
      setNumberOfPagesRemaining(parseInt(pagesRemainingFromStorage));
    }
  }, []);

  // Hàm để điều hướng đến trang thanh toán
  const handleBuyMorePages = () => {
    navigate("/payment"); // Điều hướng đến trang thanh toán
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Your Profile</h2>
        <div className="profile-info">
          <p>Status: <span>{status}</span></p>
          <p>Remaining Pages: <span>{numberOfPagesRemaining}</span></p>
        </div>
        <button className="profile-button" onClick={handleBuyMorePages}>
          Buy More Pages
        </button>
      </div>
    </div>
  );
};


