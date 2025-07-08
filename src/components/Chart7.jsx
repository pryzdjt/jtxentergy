import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Papa from 'papaparse';

const sourceKeys = ['Coal', 'Gas', 'Nuclear', 'Hydro', 'Solar'];
const agencyKeys = ['EIA', 'IEA', 'BCG'];
const coreKeys = ['DC_Mean', 'DC_Upper', 'DC_Lower', 'Total_Demand'];

const agencyLabels = {
  EIA: 'EIA Forecast',
  IEA: 'IEA Forecast',
  BCG: 'BCG Forecast',
  DC_Upper: 'DC Forecast +10%',
  DC_Lower: 'DC Forecast -10%',
  DC_Mean: 'DC Forecast Mean',
  Total_Demand: 'Total U.S. Demand',
};

const Chart7 = () => {
  const [data, setData] = useState([]);
  const [view, setView] = useState('summary');
  const [showSources, setShowSources] = useState(false);
  const [showAgencyForecasts, setShowAgencyForecasts] = useState(false);

  useEffect(() => {
    Papa.parse('/data/chart7_final_data_cleaned_FIXED.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        const cleaned = result.data.filter((row) => row.Year && !isNaN(row.Year));
        setData(cleaned);
      },
    });
  }, []);

  const handleViewChange = (_, newView) => {
    if (newView) {
      setView(newView);
      setShowSources(newView === 'detail');
      setShowAgencyForecasts(newView === 'detail');
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    const visiblePayload = payload.filter(({ dataKey }) => {
      if (coreKeys.includes(dataKey)) return true;
      if (sourceKeys.includes(dataKey)) return showSources;
      if (agencyKeys.includes(dataKey)) return showAgencyForecasts;
      return false;
    });

    return (
      <div style={{ background: 'white', border: '1px solid #ccc', padding: 10 }}>
        <strong>{label}</strong>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {visiblePayload.map(({ name, value, dataKey }) => (
            <li key={dataKey}>
              {agencyLabels[dataKey] || name}: {value?.toFixed?.(1)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderLegend = () => (
    <Box sx={{ fontSize: 12, pl: 2, pr: 2, pt: 1 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 0.5, gap: 2 }}>
        <span><strong style={{ color: '#24A148' }}>■</strong> Total U.S. Demand</span>
        <span><strong style={{ color: 'rgba(255, 105, 180, 1)' }}>■</strong> DC Forecast ±10%</span>
        <span><strong style={{ color: 'rgba(0, 105, 180, 1)' }}>■</strong> DC Forecast Mean</span>
      </Box>
      {showSources && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 0.5, gap: 2 }}>
          {sourceKeys.map((key) => (
            <span key={key}><strong>■</strong> {key}</span>
          ))}
        </Box>
      )}
      {showAgencyForecasts && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {agencyKeys.map((key) => (
            <span key={key}><strong style={{ color: 'rgba(0, 0, 0, 0.3)' }}>■</strong> {agencyLabels[key]}</span>
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Data Center (DC) Electricity Demand vs Total (2014–2030)</Typography>
        <ToggleButtonGroup value={view} exclusive onChange={handleViewChange} size="small">
          <ToggleButton value="summary">Summary</ToggleButton>
          <ToggleButton value="detail">Detail</ToggleButton>
        </ToggleButtonGroup>
        
      </Box>
      <box>        <p>DC demand rises from 1540 TWh in 2014 to 2500–4000 TWh by 2030, with a stable total demand up to present (noted on July 8, 2025).</p>
      </box>

      <FormGroup row sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={showSources} onChange={() => setShowSources(!showSources)} />}
          label="Show Source Actuals"
        />
        <FormControlLabel
          control={<Checkbox checked={showAgencyForecasts} onChange={() => setShowAgencyForecasts(!showAgencyForecasts)} />}
          label="Show Forecasts"
        />
      </FormGroup>

      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Year" />
          <YAxis yAxisId="left" tick={false}
 label={{ value: 'TWh', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />

          <Line yAxisId="left" dataKey="Total_Demand" name="Total U.S. Demand" stroke="#24A148" strokeWidth={4} dot={false} />
          <Line yAxisId="left" dataKey="DC_Mean" name="DC Forecast Mean" stroke="rgba(0, 105, 180, 1)" strokeWidth={3} dot={false} />
          <Line yAxisId="left" dataKey="DC_Upper" name="DC Forecast +10%" stroke="rgba(255, 105, 180, 1)" strokeDasharray="4 2" strokeWidth={3} dot={false} />
          <Line yAxisId="left" dataKey="DC_Lower" name="DC Forecast -10%" stroke="rgba(255, 105, 180, 1)" strokeDasharray="4 2" strokeWidth={3} dot={false} />

          {showSources && sourceKeys.map((key) => (
            <Line
              key={key}
              yAxisId="left"
              dataKey={key}
              stroke="#8884d8"
              strokeWidth={2}
              strokeDasharray="3 2"
              dot={false}
              name={key}
            />
          ))}

          {showAgencyForecasts && agencyKeys.map((key) => (
            <Line
              key={key}
              yAxisId="left"
              dataKey={key}
              stroke="rgba(0, 0, 0, 0.3)"
              strokeWidth={2}
              dot={false}
              name={agencyLabels[key]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart7;
