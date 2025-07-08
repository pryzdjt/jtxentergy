import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Papa from "papaparse";

const Chart7 = () => {
  const [data, setData] = useState([]);
  const [view, setView] = useState("summary");
  const [showForecast, setShowForecast] = useState(true);
  const [showSources, setShowSources] = useState(true);
  const [showDCShare, setShowDCShare] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/data/chart7_final_data_cleaned.csv")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch CSV");
        return response.text();
      })
      .then((csv) => {
        Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (result) => {
            const cleaned = result.data.filter(
              (row) => row.Year && !isNaN(row.Year)
            );
            console.log("Sample row:", cleaned[0]);
            setData(cleaned);
          },
        });
      })
      .catch((err) => {
        console.error("Error loading CSV:", err);
        setError("Failed to load data. Please try again.");
      });
  }, []);

  const filteredData = view === "summary" ? data.filter((d) => d.Year <= 2025) : data;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Chart 7 – Data Center Electricity Demand vs Total (2014–2030)
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setView("summary")}
          disabled={view === "summary"}
          className={`px-4 py-2 rounded ${view === "summary" ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Summary
        </button>
        <button
          onClick={() => setView("detail")}
          disabled={view === "detail"}
          className={`px-4 py-2 rounded ${view === "detail" ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Detail
        </button>
      </div>
      <div className="flex space-x-4 mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showForecast}
            onChange={() => setShowForecast(!showForecast)}
            className="mr-2"
          />
          Show Forecasts
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showSources}
            onChange={() => setShowSources(!showSources)}
            className="mr-2"
          />
          Show Source Actuals
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showDCShare}
            onChange={() => setShowDCShare(!showDCShare)}
            className="mr-2"
          />
          Show DC % of Total
        </label>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Year" />
          <YAxis label={{ value: "TWh or %", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Legend />

          {showDCShare && (
            <Line
              type="monotone"
              dataKey="DC_Share"
              stroke="#800080"
              strokeWidth={2}
              dot={false}
              name="DC % of Total"
            />
          )}

          {showForecast && (
            <>
              <Line
                type="monotone"
                dataKey="DC_Upper"
                stroke="#ff69b4"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name="DC Forecast +10%"
              />
              <Line
                type="monotone"
                dataKey="DC_Lower"
                stroke="#ff69b4"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name="DC Forecast -10%"
              />
              <Line
                type="monotone"
                dataKey="DC_Mean"
                stroke="#007bff"
                strokeWidth={3}
                dot
                name="DC Forecast Mean"
              />
            </>
          )}

          {showSources && (
            <>
              <Line dataKey="Coal" stroke="#8B4513" strokeWidth={2} dot={false} name="Coal" />
              <Line dataKey="Natural_Gas" stroke="#FFA500" strokeWidth={2} dot={false} name="Gas" />
              <Line dataKey="Nuclear" stroke="#90EE90" strokeWidth={2} dot={false} name="Nuclear" />
              <Line dataKey="Hydro" stroke="#1E90FF" strokeWidth={2} dot={false} name="Hydro" />
              <Line dataKey="Solar" stroke="#00CED1" strokeWidth={2} dot={false} name="Solar" />
            </>
          )}

          <Line
            type="monotone"
            dataKey="Total_Demand"
            stroke="#00cc00"
            strokeWidth={3}
            dot
            name="Total U.S. Demand"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart7;