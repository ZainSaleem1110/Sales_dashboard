// src/App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";
import * as XLSX from 'xlsx';
import defaultData from "./data.json";
import Dashboard from "./dashboard";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(defaultData); // load initial data
  }, []);

  const handleJsonFile = (e) => {
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

  const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

  const handleExcelFile = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawJson = XLSX.utils.sheet_to_json(worksheet, { raw: false });

  const jsonData = rawJson.map((item) => ({
    ...item,
    "Order Date": formatDate(item["Order Date"]),
    "Ship Date": formatDate(item["Ship Date"]),
  }));
    setData(jsonData)
  };

  return (
    <>
      <h1 className="heading">Sales Dashboard</h1>
      <div className="button_bar">
        <div>
          <label htmlFor="excel-upload" className="custom-file-upload">
            📄 Upload Excel File
          </label>
          <input
            id="excel-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelFile}
            style={{ display: "none" }}
          />
        </div>
        <div>
          <label htmlFor="file-upload" className="custom-file-upload">
            📁 Upload JSON File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleJsonFile}
          />
        </div>
        <a
          href="/Sample_Data.xls"
          download
          className="download_sample_file"
        >
          ⬇️ Download Sample Excel File
        </a>
      </div>

      <Dashboard data={data} />
    </>
  );
}

export default App;
