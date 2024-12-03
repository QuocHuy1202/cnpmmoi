import React, { useState } from "react";
import image from "../image/image.png";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer

const backendUrl = "http://localhost:5001";

export const Login = () => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu.");
    } else {
      setError(""); // Clear error message if both fields are filled

      try {
        const response = await fetch(`${backendUrl}/api/account/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }), // Send email and password in the body
        });

        if (response.ok) {
          // Successful login
          const data = await response.json();
          setToken(data.token);
          console.log(data); // Save token in state
          localStorage.setItem("token", data.token); // Store token in localStorage
          localStorage.setItem("status", data.status);
          localStorage.setItem(
            "number_of_pages_remaining",
            data.number_of_pages_remaining
          );
          localStorage.setItem("account_type", data.account_type); // Save account_type
          
          toast.success("Đăng nhập thành công!"); // Show success message
          const accountType = data.account_type;

          // Kiểm tra giá trị account_type và điều hướng
          if (accountType === "Student") {
            navigate("/"); // Redirect to the home page after login
          } else {
            navigate("/spso"); // Redirect to another page
          }
                    
        } else {
          // Login failed, handle error
          const errorData = await response.json();
          const errorMessage = errorData.message || "Login failed!";
          toast.error(errorMessage); // Show error message with toast
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="login-container">
      {/* Header */}
      <header className="login-header">
        <div className="logo">
          <img src={image} alt="Logo" />
        </div>
        <h1>Dịch vụ xác thực tập trung</h1>
      </header>

      {/* Main Section */}
      <main className="login-main">
        <div className="login-box">
          <h2>Đăng Nhập</h2>
          <form>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="button-group">
              <li className="login-button" onClick={handleLogin}>
                Đăng Nhập
              </li>
              <Link to="/" className="exit-button">
                Thoát
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* ToastContainer to show toast notifications */}
      <ToastContainer />
    </div>
  );
};
