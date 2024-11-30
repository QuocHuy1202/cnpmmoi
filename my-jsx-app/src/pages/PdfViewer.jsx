import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";

const PdfViewer = ({ pdfUrl }) => {
  const [isRendering, setIsRendering] = useState(false); // Trạng thái render
  const [numPages, setNumPages] = useState(0); // Số trang của PDF
  const containerRef = useRef(null); // Ref cho container chứa các trang

  useEffect(() => {
    const loadPdf = async () => {
      setIsRendering(true); // Bắt đầu render

      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        setNumPages(pdf.numPages); // Lấy số trang PDF

        // Render từng trang
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
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

    loadPdf(); // Gọi hàm loadPdf khi pdfUrl thay đổi
  }, [pdfUrl, numPages]); // Chạy lại khi pdfUrl hoặc numPages thay đổi

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
      <PdfViewer pdfUrl="https://res.cloudinary.com/dzaaf6exo/image/upload/v1732980102/adxplfmxtsud5dgwk8yy.pdf" />
    </div>
  );
};