import React, { useState } from "react";
import "../css/printsetting.css";
import { useNavigate } from "react-router-dom";
import { Printte } from "./PdfViewer";
export const PrintPage = () => {
  const [copies, setCopies] = useState(1);
  const [orientation, setOrientation] = useState("Portrait");
  const [pageSize, setPageSize] = useState("A4");
  const [pageRange, setPageRange] = useState("all");
  const [customPages, setCustomPages] = useState("");
  const [duplex, setDuplex] = useState("No");
  const [margin, setMargin] = useState("Normal");
  const [pagesPerSheet, setPagesPerSheet] = useState(1);
  const navigate = useNavigate();
  const handlePrint = () => {
    // In thực tế cần logic để gửi thông tin đến máy in
    const printSettings = {
      copies,
      orientation,
      pageSize,
      pageRange,
      customPages,
      duplex,
      margin,
      pagesPerSheet,
    };
    localStorage.setItem("printSettings", JSON.stringify(printSettings));
    navigate("/print")
  };
  const handleCancel = () => {
    // Điều hướng đến trang "/link" khi nhấn "Cancel"
    navigate("/print"); // Dùng navigate để chuyển hướng
  };
  return (
    <div className="print-page">
      {/* Sidebar for print settings */}
      <aside className="sidebar">
        <h2>Print Settings</h2>
        <div className="settings">
          <label htmlFor="copies">Copies:</label>
          <select
            id="copies"
            value={copies}
            onChange={(e) => setCopies(Number(e.target.value))}
          >
            {[...Array(10).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="settings">
          <label htmlFor="orientation">Orientation:</label>
          <select
            id="orientation"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
          >
            <option value="Portrait">Portrait</option>
            <option value="Landscape">Landscape</option>
          </select>
        </div>
        <div className="settings">
          <label htmlFor="pageSize">Page Size:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          >
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="Legal">Legal</option>
          </select>
        </div>
        <div className="settings">
          <label htmlFor="pageRange">Page Range:</label>
          <select
            id="pageRange"
            value={pageRange}
            onChange={(e) => setPageRange(e.target.value)}
          >
            <option value="all">All Pages</option>
            <option value="custom">Custom</option>
          </select>
          {pageRange === "custom" && (
            <input
              type="text"
              id="customPages"
              placeholder="e.g., 1,3,5-7"
              value={customPages}
              onChange={(e) => setCustomPages(e.target.value)}
            />
          )}
        </div>
        <div className="settings">
          <label htmlFor="duplex">Duplex:</label>
          <select
            id="duplex"
            value={duplex}
            onChange={(e) => setDuplex(e.target.value)}
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>
        <div className="settings">
          <label htmlFor="margin">Margins:</label>
          <select
            id="margin"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
          >
            <option value="Normal">Normal</option>
            <option value="Narrow">Narrow</option>
            <option value="Wide">Wide</option>
          </select>
        </div>
        <div className="settings">
          <label htmlFor="pagesPerSheet">Pages per Sheet:</label>
          <select
            id="pagesPerSheet"
            value={pagesPerSheet}
            onChange={(e) => setPagesPerSheet(Number(e.target.value))}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="4">4</option>
          </select>
        </div>
        <div className="buttons">
          <button className="print-button" onClick={handlePrint}>
            Confirm
          </button>
          <button className="cancel-button"onClick={handleCancel} >Cancel</button>
        </div>
      </aside>

      {/* Preview section */}
      <main className="preview">
        <h2>Print Preview</h2>
        <div className={`page-preview ${orientation.toLowerCase()}`}>
        <Printte pdfUrl="https://res.cloudinary.com/dzaaf6exo/image/upload/v1732980102/adxplfmxtsud5dgwk8yy.pdf" />
        </div>
      </main>
    </div>
  );
};
