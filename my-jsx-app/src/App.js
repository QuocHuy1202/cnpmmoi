// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SPSO } from "./pages/spso.jsx";  // Import component TrangCh
import {Login} from "./pages/login.jsx"
import { TaiFile } from "./pages/loadfile.jsx"
import {PrintPage} from "./pages/printsetting.jsx"
import {Print} from "./pages/print.jsx"
import {Homen} from "./pages/home.jsx"
import {PrintHistory} from "./pages/printhistory.jsx"
import {PaymentHistory} from "./pages/paymentlist.jsx"
import { Payment } from "./pages/payment.jsx"
import { Profile } from "./pages/profile.jsx"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    
      <Router>
        
          <Routes>
            <Route path="/" element={<Homen />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/paymentlist" element={<PaymentHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/print" element={<Print />} />
            <Route path="/loadfile" element={<TaiFile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/printsetting" element={<PrintPage />} />
            <Route path="/history" element={<PrintHistory />} /> 
            <Route path="/spso" element={<SPSO />} /> 
          </Routes>
      </Router>
    
  );
}

export default App;
