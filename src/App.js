// src/App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";
import defaultData from "./data.json";
import Dashboard from "./dashboard";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(defaultData); // load initial data
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.map((d) => ({
            ...d,
            OrderDate: new Date(d["Order Date"]),
            Sales: parseFloat(d.Sales) || 0,
            Profit: parseFloat(d.Profit) || 0,
            Discount: parseFloat(d.Discount) || 0,
          }));
          setData(cleaned);
        } else {
          alert("JSON must be an array of objects.");
        }
      } catch (err) {
        console.error(err);
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <h1 className="heading">Sales Dashboard</h1>
      <div className="button_bar">
        <div>
          <label htmlFor="file-upload" className="custom-file-upload">
            📁 Upload JSON File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleFileUpload}
          />
        </div>
        <a
          href="/data.json"
          download="sample-sales-data.json"
          className="download_sample_file"
        >
          ⬇️ Download Sample JSON File
        </a>
      </div>

      <Dashboard data={data} />
    </>
  );
}

export default App;
