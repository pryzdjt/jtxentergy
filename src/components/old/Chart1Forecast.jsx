// src/components/Chart1Forecast.jsx
import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const Chart1Forecast = () => {
  const [data, setData] = useState([]);
  const [view, setView] = useState('summary');

  useEffect(() => {
    fetch('/data/jtx_data.csv')
      .then((res) => res.text())
      .then((csv) => {
        const [headerLine, ...lines] = csv.trim().split('\n');
        const headers = headerLine.split(',');
        const parsed = lines.map(line => {
          const values = line.split(',');
          const obj = {};
          headers.forEach((h, i) => {
            const val = values[i]?.replace(/,/g, '');
            obj[h] = isNaN(+val) ? val : +val;
          });
          return obj;
        });
        setData(parsed);
      });
  }, []);

  const handleViewChange = (_, newView) => {
    if (newView) setView(newView);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Chart 1 – Electricity Demand Forecast vs Actual (2013–2030)</Typography>
        <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} size="small">
          <ToggleButton value="summary">Summary</ToggleButton>
          <ToggleButton value="detail">Detail</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Year" />
          <YAxis label={{ value: 'TWh', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />

          <Line dataKey="Actual_Demand_TWh" name="Actual Demand" stroke="#24A148" strokeWidth={2} />
          <Line dataKey="Forecast_Demand_TWh" name="Forecast Mean" stroke="#0072C3" strokeWidth={2} />
          <Line dataKey="Forecast_Lower_TWh" name="Forecast -10%" stroke="#FF69B4" strokeDasharray="4 2" strokeWidth={1.5} />
          <Line dataKey="Forecast_Upper_TWh" name="Forecast +10%" stroke="#FF69B4" strokeDasharray="4 2" strokeWidth={1.5} />

          {view === 'detail' && (
            <>
              <Line dataKey="BNEF" stroke="#999" dot={false} strokeWidth={1} name="BNEF" />
              <Line dataKey="McKinsey" stroke="#aaa" dot={false} strokeWidth={1} name="McKinsey" />
              <Line dataKey="Goldman_Sachs" stroke="#bbb" dot={false} strokeWidth={1} name="Goldman Sachs" />
              <Line dataKey="EPRI_higher" stroke="#ccc" dot={false} strokeWidth={1} name="EPRI Higher" />
              <Line dataKey="Jeffries" stroke="#ddd" dot={false} strokeWidth={1} name="Jeffries" />
              <Line dataKey="LBNL_high" stroke="#ccc" dot={false} strokeWidth={1} name="LBNL High" />
              <Line dataKey="IEA" stroke="#bbb" dot={false} strokeWidth={1} name="IEA" />
              <Line dataKey="S_P" stroke="#aaa" dot={false} strokeWidth={1} name="S&P" />
              <Line dataKey="BCG" stroke="#999" dot={false} strokeWidth={1} name="BCG" />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart1Forecast;
