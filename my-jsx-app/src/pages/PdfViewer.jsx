import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";

const PdfViewer = () => {
  const [isRendering, setIsRendering] = useState(false); // Trạng thái render
  const [numPages, setNumPages] = useState(0); // Số trang của PDF
  const containerRef = useRef(null); // Ref cho container chứa các trang

  useEffect(() => {
    const loadPdf = async () => {
      setIsRendering(true); // Bắt đầu render

      try {
        // Lấy file_path từ localStorage
        const storedFile = JSON.parse(localStorage.getItem("selectedFile"));
        console.log(storedFile);
        const pdfUrl = storedFile?.path;

        if (!pdfUrl) {
          throw new Error("Không tìm thấy file_path trong localStorage.");
        }

        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        setNumPages(pdf.numPages); // Lấy số trang PDF

        // Render từng trang
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum); // Lấy trang
          const scale = 1.5; // Độ phóng đại
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas"); // Tạo canvas cho mỗi trang
          const context = canvas.getContext("2d");

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          // Thêm canvas vào container
          containerRef.current.appendChild(canvas);

          // Render trang vào canvas
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;
        }
      } catch (error) {
        console.error("Render error:", error);
      } finally {
        setIsRendering(false); // Đánh dấu render xong
      }
    };

    loadPdf(); // Gọi hàm loadPdf khi component mount
  }, []); // Chỉ chạy một lần khi component mount

  return (
    <div>
      {/* Hiển thị thông báo khi đang render */}
      {isRendering && <div>Rendering PDF...</div>}
      
      {/* Container chứa các trang PDF */}
      <div ref={containerRef} style={{ overflowY: "auto", height: "600px" }}></div>
    </div>
  );
};

export const Printte = () => {
  return (
    <div>
      <PdfViewer />
    </div>
  );
};
