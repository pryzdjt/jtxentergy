import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import Papa from "papaparse";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

const COLORS = {
  coal: "#A67B5B",
  gas: "#D9A066",
  nuclear: "#0070C0",
  solar: "#4DA1D9",
  wind: "#90CAF9",
  coal_pct: "#A67B5B",
  gas_pct: "#D9A066",
  nuclear_pct: "#0070C0",
  solar_pct: "#4DA1D9",
  wind_pct: "#90CAF9",
};

const getKeys = (mode) =>
  mode === "mwh"
    ? ["coal", "gas", "nuclear", "solar", "wind"]
    : ["coal_pct", "gas_pct", "nuclear_pct", "solar_pct", "wind_pct"];

const annotations = [
  { year: 2022, label: "IRA Passed" },
  { year: 2024, label: "Clean > 40%" },
];

export default function Chart2FossilToClean() {
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("percent");
  const [showIncentives, setShowIncentives] = useState(false);
  const [incentives, setIncentives] = useState([]);

  useEffect(() => {
    Papa.parse("/data/chart2.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: ({ data }) => {
        const parsed = data
          .filter((row) => row.Year)
          .map((row) => {
            const total = row.Coal + row.Gas + row.Nuclear + row.Solar + row.Wind;
            return {
              year: row.Year,
              coal: row.Coal / 1_000_000, // Convert to TWh
              gas: row.Gas / 1_000_000,
              nuclear: row.Nuclear / 1_000_000,
              solar: row.Solar / 1_000_000,
              wind: row.Wind / 1_000_000,
              coal_pct: row.Coal / total,
              gas_pct: row.Gas / total,
              nuclear_pct: row.Nuclear / total,
              solar_pct: row.Solar / total,
              wind_pct: row.Wind / total,
            };
          });
        setData(parsed);
      },
    });

    Papa.parse("/data/incentives.csv", {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: ({ data }) => {
        const parsed = data.filter((d) => d.start && d.end);
        setIncentives(parsed);
      },
    });
  }, []);

  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h6" mb={1}>
        Fossil to Clean Electricity Mix
      </Typography>
      <p>Coal declines to ~28.8 TWh in 2023, while clean energy nears 40% by 2024, driven by Solar and Wind growth.</p>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(e, val) => val && setMode(val)}
          size="small"
        >
          <ToggleButton value="mwh">TWh</ToggleButton>
          <ToggleButton value="percent">% Share</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{ top: 40, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis
            tickFormatter={(v) =>
              mode === "mwh" ? `${v.toFixed(1)} TWh` : `${(v * 100).toFixed(0)}%`
            }
            domain={mode === "mwh" ? [0, "auto"] : [0, 1]}
          />

          <Tooltip
            content={({ payload, label }) => {
              if (!payload || !payload.length) return null;

              const fossil = ["coal", "gas", "coal_pct", "gas_pct"];
              const clean = ["nuclear", "solar", "wind", "nuclear_pct", "solar_pct", "wind_pct"];

              const isMWh = payload[0].name.includes("pct") === false;

              const format = (val) =>
                isMWh ? `${val.toFixed(1)} TWh` : `${(val * 100).toFixed(1)}%`;

              const section = (title, keys) => {
                const items = payload.filter((p) => keys.includes(p.name));
                if (!items.length) return null;
                return (
                  <>
                    <div style={{ fontWeight: 600, color: "#555", marginTop: 6 }}>{title}</div>
                    {items.map(({ name, value, color }) => (
                      <div
                        key={name}
                        style={{ display: "flex", alignItems: "center", marginBottom: 2 }}
                      >
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            backgroundColor: color,
                            display: "inline-block",
                            marginRight: 6,
                            borderRadius: 2,
                          }}
                        />
                        <span style={{ flex: 1, color: "#333" }}>{name.replace("_pct", "")}</span>
                        <span style={{ fontWeight: 500 }}>{format(value)}</span>
                      </div>
                    ))}
                  </>
                );
              };

              return (
                <div
                  style={{
                    background: "#fff",
                    padding: 12,
                    border: "1px solid #ccc",
                    borderRadius: 4,
                    fontSize: 13,
                    maxWidth: 220,
                  }}
                >
                  <div style={{ fontWeight: "bold", marginBottom: 4 }}>{label}</div>
                  {section("Fossil Fuels", fossil)}
                  {section("Clean Energy", clean)}
                </div>
              );
            }}
          />

          <Legend />

          {showIncentives &&
            incentives.map((band, i) => (
              <ReferenceArea
                key={i}
                x1={band.start}
                x2={band.end}
                y1={0}
                y2={mode === "mwh" ? "auto" : 1}
                stroke="#0070C0"
                fill="#0070C0"
                fillOpacity={0.07}
                ifOverflow="extendDomain"
              />
            ))}

          {annotations.map((a, i) => (
            <ReferenceLine
              key={`marker-${i}`}
              x={a.year}
              stroke="#4D4D4D"
              strokeDasharray="3 3"
              label={{
                value: a.label,
                position: "top",
                fill: "#4D4D4D",
                fontSize: 12,
              }}
            />
          ))}

          {getKeys(mode).map((key) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId="1"
              stroke={COLORS[key]}
              fill={COLORS[key]}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}