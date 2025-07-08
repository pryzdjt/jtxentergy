import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import Papa from "papaparse";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

const WARM_COLORS = {
  // Total: "url(#totalGradientSummer)",
  Coal: "#E53935",
  Gas: "#FB8C00",
  Wind: "#FDD835",
  Solar: "#F4511E",
  Nuclear: "#8E24AA"
};

const COOL_COLORS = {
  // Total: "url(#totalGradientWinter)",
  Coal: "#1976D2",
  Gas: "#26C6DA",
  Wind: "#66BB6A",
  Solar: "#26A69A",
  Nuclear: "#5C6BC0"
};

// const ALL_SOURCES = ["Total", "Coal", "Gas", "Wind", "Solar", "Nuclear"];
const ALL_SOURCES = ["Coal", "Gas", "Wind", "Solar", "Nuclear"]; // Commented out Total

export default function Chart6SeasonalTabs() {
  const [data, setData] = useState([]);
  const [selectedSources, setSelectedSources] = useState(["Coal", "Gas", "Wind", "Solar", "Nuclear"]); // Default to all sources
  const [tab, setTab] = useState(0);

  useEffect(() => {
    Papa.parse("/data/chart6_winter_sources.csv", {
      header: true,
      download: true,
      dynamicTyping: false,
      complete: ({ data }) => {
        const parsed = data.map((row) => {
          const base = {
            label: row.Label?.trim(),
            Coal: parseFloat(row.Coal?.replace(/,/g, "")) || 0,
            Gas: parseFloat(row.Gas?.replace(/,/g, "")) || 0,
            Wind: parseFloat(row.Wind?.replace(/,/g, "")) || 0,
            Solar: parseFloat(row.Solar?.replace(/,/g, "")) || 0,
            Nuclear: parseFloat(row.Nuclear?.replace(/,/g, "")) || 0
          };
          // return { ...base, Total: base.Coal + base.Gas + base.Wind + base.Solar + base.Nuclear };
          return base; // Removed Total calculation since it's no longer needed
        });
        setData(parsed);
      }
    });
  }, []);

  const filteredData = (season) => {
    return data.filter((row) => {
      const [year, quarter] = row.label.split(" ");
      return season === "winter"
        ? quarter === "Q1" || quarter === "Q4"
        : quarter === "Q2" || quarter === "Q3";
    });
  };

  const toggleSource = (source) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  const toggleAll = () => {
    if (selectedSources.length === ALL_SOURCES.length) {
      setSelectedSources([]);
    } else {
      setSelectedSources([...ALL_SOURCES]);
    }
  };

  const customTick = (tick) => {
    const [year, quarter] = tick.split(" ");
    return `${quarter} ${year}`;
  };

  const renderCharts = (seasonData, palette, gradientId) => (
    <>
      <svg width="0" height="0">
        <defs>
          {/* <linearGradient id="totalGradientWinter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0D47A1" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#E53935" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="totalGradientSummer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E53935" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#0D47A1" stopOpacity={0.6} />
          </linearGradient> */}
        </defs>
      </svg>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
        <Button variant="outlined" onClick={toggleAll}>Toggle All</Button>
        <FormGroup row>
          {ALL_SOURCES.map((source) => (
            <FormControlLabel
              key={source}
              control={
                <Checkbox
                  checked={selectedSources.includes(source)}
                  onChange={() => toggleSource(source)}
                />
              }
              label={source}
            />
          ))}
        </FormGroup>
      </Box>

      <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
        <ResponsiveContainer width="50%" height={400}>
          <LineChart data={seasonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tickFormatter={customTick} />
            <YAxis tickFormatter={(v) => (v / 1_000_000).toFixed(1) + "M"} />
            <Tooltip
              formatter={(v, name) => [`${v.toLocaleString()} MWh`, name]}
            />
            <Legend />
            {selectedSources.map((key) => (
              <Line
                key={key}
                dataKey={key}
                stroke={palette[key] || "#999"}
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="50%" height={400}>
          <BarChart data={seasonData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tickFormatter={customTick} />
            <YAxis tickFormatter={(v) => (v / 1_000_000).toFixed(1) + "M"} />
            <Tooltip
              formatter={(v, name) => [`${v.toLocaleString()} MWh`, name]}
            />
            <Legend />
            {selectedSources.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="1"
                fill={palette[key] || "#999"}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </>
  );

  return (
    <Box>
      <Typography variant="h6" mb={1}>Chart 6 – Seasonal Electricity Generation</Typography>
      <p>Solar drops in winter (e.g., 1,400,000 MWh in Q4 2023), while Gas dominates (e.g., 18,000,000 MWh) and Wind slightly rises.</p>
      <Tabs value={tab} onChange={(_, val) => setTab(val)}>
        <Tab label="Winter (Q4 → Q1)" />
        <Tab label="Summer (Q2 → Q3)" />
      </Tabs>

      {tab === 0 && renderCharts(filteredData("winter"), COOL_COLORS, "totalGradientWinter")}
      {tab === 1 && renderCharts(filteredData("summer"), WARM_COLORS, "totalGradientSummer")}
    </Box>
  );
}