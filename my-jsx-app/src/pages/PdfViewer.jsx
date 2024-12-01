import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";
import mammoth from "mammoth";

const PdfViewer = () => {
  const [isRendering, setIsRendering] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const loadFile = async () => {
      setIsRendering(true);

      try {
        const storedFile = JSON.parse(localStorage.getItem("selectedFile"));
        const filePath = storedFile?.path;
        console.log(storedFile);
        if (!filePath) {
          throw new Error("Không tìm thấy file_path trong localStorage.");
        }

        const fileType = storedFile?.type;

        containerRef.current.innerHTML = ""; // Clear container

        switch (fileType) {
          case "pdf":
            await renderPdf(filePath, containerRef);
            break;
          case "docx":
            await renderDocx(filePath, containerRef);
            break;
          case "jpg":
          case "png":
            renderImage(filePath, containerRef);
            break;
          default:
            throw new Error(`Không hỗ trợ loại tệp: ${fileType}`);
        }
      } catch (error) {
        console.error("Error loading file:", error);
      } finally {
        setIsRendering(false);
      }
    };

    loadFile();
  }, []);

  return (
    <div>
      {isRendering && <div>Rendering file...</div>}
      <div ref={containerRef} style={{ overflowY: "auto", height: "600px" }}></div>
    </div>
  );
};

const getFileType = (filePath) => {
  return filePath?.split(".").pop().toLowerCase();
};

const renderPdf = async (filePath, containerRef) => {
  const pdf = await pdfjsLib.getDocument(filePath).promise;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    containerRef.current.appendChild(canvas);

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
  }
};

const renderDocx = async (filePath, containerRef) => {
  try {
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();

    const result = await mammoth.extractRawText({ arrayBuffer });
    const content = document.createElement("div");
    content.innerText = result.value;
    containerRef.current.appendChild(content);
  } catch (error) {
    console.error("Error rendering DOCX:", error);
  }
};

const renderImage = (filePath, containerRef) => {
  const img = document.createElement("img");
  img.src = filePath;
  img.alt = "Document Image";
  img.style.maxWidth = "100%";
  img.style.height = "auto";

  containerRef.current.appendChild(img);
};

export const Printte = () => {
  return (
    <div>
      <PdfViewer />
    </div>
  );
};
