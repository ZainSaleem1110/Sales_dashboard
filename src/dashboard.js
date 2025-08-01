import React from "react";
import Plot from "react-plotly.js";
import dayjs from "dayjs";

const Dashboard = ({ data }) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  const formatDate = (dateStr) =>
    dayjs(dateStr, ["MM/DD/YYYY", "M/D/YYYY"]).format("YYYY-MM-DD");

  const dates = data.map((d) => formatDate(d["Order Date"]));
  const sales = data.map((d) => d.Sales);
  const categorySales = {};
  const regionProfit = {};
  const segmentSales = {};
  const discounts = [];
  const profits = [];

  data.forEach((d) => {
    // Pie
    categorySales[d.Category] = (categorySales[d.Category] || 0) + d.Sales;
    // Map
    regionProfit[d.Region] = (regionProfit[d.Region] || 0) + d.Profit;
    // Segment
    segmentSales[d.Segment] = (segmentSales[d.Segment] || 0) + d.Sales;
    // Scatter
    discounts.push(d.Discount);
    profits.push(d.Profit);
  });

  return (
    <div className="container">
      {/* 1. Sales Over Time */}
      <Plot
        data={[
          {
            x: dates,
            y: sales,
            type: "scatter",
            mode: "lines+markers",
            marker: { color: "blue" },
          },
        ]}
        layout={{ title: "Total Sales Over Time", xaxis: { title: "Date" }, yaxis: { title: "Sales ($)" } }}
        config={{ scrollZoom: true, displayModeBar: false }}
      />

      {/* 2. Sales by Category Pie Chart */}
      <Plot
        data={[
          {
            type: "pie",
            labels: Object.keys(categorySales),
            values: Object.values(categorySales),
            hole: 0.4,
          },
        ]}
        layout={{ title: "Sales by Category" }}
        config={{ scrollZoom: true, displayModeBar: false }}
      />

      {/* 3. Profit by Region */}
      <Plot
        data={[
          {
            type: "bar",
            x: Object.keys(regionProfit),
            y: Object.values(regionProfit),
            marker: { color: "orange" },
          },
        ]}
        layout={{ title: "Profit by Region", xaxis: { title: "Region" }, yaxis: { title: "Profit" } }}
        config={{ scrollZoom: true, displayModeBar: false }}
      />

      {/* 4. Sales by Segment */}
      <Plot
        data={[
          {
            type: "bar",
            x: Object.keys(segmentSales),
            y: Object.values(segmentSales),
            marker: { color: "teal" },
          },
        ]}
        layout={{ title: "Sales by Customer Segment" }}
        config={{ scrollZoom: true, displayModeBar: false }}
      />

      {/* 5. Discount vs Profit */}
      <Plot
        data={[
          {
            x: discounts,
            y: profits,
            mode: "markers",
            type: "scatter",
            marker: { color: "red" },
          },
        ]}
        layout={{ title: "Discount vs Profit", xaxis: { title: "Discount" }, yaxis: { title: "Profit" } }}
        config={{ scrollZoom: true, displayModeBar: false }}
      />
    </div>
  );
};

export default Dashboard;
