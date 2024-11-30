import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import image from "../image/image.png";
import "../css/style.css";

export const SPSO = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/employees')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  return (
    <div>
      {data.map((item) => (
        <div key={item.StudentID}>
          <p>{item.FirstName}</p>
        </div>
      ))}
    </div>
  );
};


