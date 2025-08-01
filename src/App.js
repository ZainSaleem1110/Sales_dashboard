// src/App.jsx
import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import './App.css';

const stateMap = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
  "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
  "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
  "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD", "Massachusetts": "MA",
  "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO", "Montana": "MT",
  "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM",
  "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
  "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
  "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
};

function App() {
  const [data, setData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.map(d => ({
            ...d,
            OrderDate: new Date(d["Order Date"]),
            Sales: parseFloat(d.Sales) || 0,
            Profit: parseFloat(d.Profit) || 0,
            Discount: parseFloat(d.Discount) || 0
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

  if (!data.length) {
    return (
      <div className="container">
        <h1>📊 Sales Dashboard (React + Plotly)</h1>
        <input type="file" accept=".json" onChange={handleFileUpload} />
        <p>Upload a sales JSON file to begin</p>
      </div>
    );
  }

  // 1. Sales Over Time
  const salesOverTime = data.reduce((acc, d) => {
    const date = d.OrderDate.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + d.Sales;
    return acc;
  }, {});
  const dates = Object.keys(salesOverTime).sort();
  const sales = dates.map(date => salesOverTime[date]);

  // 2. Sales by Category
  const categorySales = data.reduce((acc, d) => {
    acc[d.Category] = (acc[d.Category] || 0) + d.Sales;
    return acc;
  }, {});

  // 3. Profit by State
  const profitByState = data.reduce((acc, d) => {
    const code = stateMap[d.State];
    if (code) acc[code] = (acc[code] || 0) + d.Profit;
    return acc;
  }, {});

  // 4. Segment Sales
  const segmentSales = data.reduce((acc, d) => {
    acc[d.Segment] = (acc[d.Segment] || 0) + d.Sales;
    return acc;
  }, {});

  // 5. Scatter Plot
  const discounts = data.map(d => d.Discount);
  const profits = data.map(d => d.Profit);

  return (
    <>
     <h1>📊 Sales Dashboard (React + Plotly)</h1>
      <input type="file" accept=".json" onChange={handleFileUpload} />
    <div className="container">

      <Plot
        data={[{
          x: dates,
          y: sales,
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'blue' }
        }]}
        layout={{ title: 'Total Sales Over Time', xaxis: { title: 'Date' }, yaxis: { title: 'Sales ($)' } }}
        config={{ scrollZoom: true }}
      />

      <Plot
        data={[{
          type: 'pie',
          labels: Object.keys(categorySales),
          values: Object.values(categorySales),
          hole: 0.4
        }]}
        layout={{ title: 'Sales by Category' }}
        config={{ scrollZoom: true }}
      />

      <Plot
        data={[{
          type: 'choropleth',
          locationmode: 'USA-states',
          locations: Object.keys(profitByState),
          z: Object.values(profitByState),
          colorscale: 'YlGnBu',
          colorbar: { title: 'Profit ($)' }
        }]}
        layout={{ title: 'Profit by State', geo: { scope: 'usa' } }}
        config={{ scrollZoom: true }}
      />

      <Plot
        data={[{
          x: Object.keys(segmentSales),
          y: Object.values(segmentSales),
          type: 'bar',
          marker: { color: 'orange' }
        }]}
        layout={{ title: 'Customer Segment Performance', xaxis: { title: 'Segment' }, yaxis: { title: 'Sales ($)' } }}
        config={{ scrollZoom: true }}
      />

      <Plot
        data={[{
          x: discounts,
          y: profits,
          mode: 'markers',
          type: 'scatter',
          marker: { color: 'red' }
        }]}
        layout={{ title: 'Discount vs Profit', xaxis: { title: 'Discount' }, yaxis: { title: 'Profit ($)' } }}
        config={{ scrollZoom: true }}
      />
    </div>
    </>
  );
}

export default App;
