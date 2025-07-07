import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const agencyKeys = [
  'LBNL_high', 'BCG', 'EPRI_higher', 'Jeffries', 'Goldman_Sachs',
  'McKinsey', 'IEA', 'S_P', 'IEA_2025', 'EPRI_moderate', 'EPRI_low'
];

const agencyLabels = {
  LBNL_high: 'LBNL High',
  BCG: 'BCG',
  EPRI_higher: 'EPRI Higher',
  Jeffries: 'Jeffries',
  Goldman_Sachs: 'Goldman Sachs',
  McKinsey: 'McKinsey',
  IEA: 'IEA',
  S_P: 'S&P',
  IEA_2025: 'IEA 2025',
  EPRI_moderate: 'EPRI Moderate',
  EPRI_low: 'EPRI Low'
};

const sourceKeys = [
  'Coal_TWh', 'Natural_Gas_TWh', 'Petroleum_TWh',
  'Nuclear_TWh', 'Hydro_TWh', 'Solar_TWh', 'Wind_TWh', 'Other_TWh'
];

const sourceColors = [
  '#66BB6A', '#FFA726', '#FFEB3B', '#8D6E63', '#42A5F5', '#AED581', '#FF7043', '#26C6DA'
];

const excludedFromAdjustment = ['Solar_TWh', 'Other_TWh', 'Nuclear_TWh', 'Natural_Gas_TWh'];

const Chart1ForecastWithToggle = () => {
  const [rawData, setRawData] = useState([]);
  const [data, setData] = useState([]);
  const [view, setView] = useState('summary');
  const [showSources, setShowSources] = useState(false);
  const [showForecasts, setShowForecasts] = useState(false);

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
            const parsedVal = parseFloat(val);
            if (!isNaN(parsedVal) && parsedVal !== 0) {
              obj[h] = parsedVal;
            }
          });
          return obj;
        });

        const adjusted = parsed.map((row, idx, arr) => {
          const newRow = { ...row };
          sourceKeys.forEach((key) => {
            if (newRow[key] != null) {
              const shouldAdjust = !excludedFromAdjustment.includes(key);
              const current = shouldAdjust ? newRow[key] * 24 : newRow[key];
              const prev = idx > 0 && arr[idx - 1][key] ? (shouldAdjust ? arr[idx - 1][key] * 24 : arr[idx - 1][key]) : null;
              newRow[key] = current;
              newRow[`${key}_yoy`] = prev ? `${(((current - prev) / prev) * 100).toFixed(1)}%` : '–';
            }
          });
          return newRow;
        });

        setRawData(adjusted);
      });
  }, []);

  useEffect(() => {
    let filtered = [...rawData];
    if (showSources && !showForecasts) {
      filtered = rawData.filter(row => row.Year <= 2025);
    }
    setData(filtered);
  }, [rawData, showSources, showForecasts]);

  const handleViewChange = (_, newView) => {
    if (newView) setView(newView);
    if (newView === 'detail') {
      setShowSources(true);
      setShowForecasts(true);
    } else {
      setShowSources(false);
      setShowForecasts(false);
    }
  };

  const renderLegend = () => {
    return (
      <Box sx={{ fontSize: 12, pl: 2, pr: 2, pt: 1 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 0.5, gap: 2 }}>
          <span><strong style={{ color: '#24A148' }}>■</strong> Actual Demand</span>
          <span><strong style={{ color: 'rgba(255, 105, 180, 1)' }}>■</strong> Forecast ±10%</span>
          <span><strong style={{ color: 'rgba(0, 105, 180, 1)' }}>■</strong> Forecast Mean</span>
        </Box>
        {showSources && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 0.5, gap: 2 }}>
            {sourceKeys.map((key, idx) => (
              <span key={key}><strong style={{ color: sourceColors[idx % sourceColors.length] }}>■</strong> {key.replace('_TWh', '').replace('_', ' ')}</span>
            ))}
          </Box>
        )}
        {showForecasts && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {agencyKeys.map((key) => (
              <span key={key}><strong style={{ color: 'rgba(0, 0, 0, 0.3)' }}>■</strong> {agencyLabels[key]}</span>
            ))}
          </Box>
        )}
      </Box>
    );
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

      <FormGroup row sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <FormControlLabel
          control={<Checkbox checked={showSources} onChange={() => setShowSources(!showSources)} />}
          label="Show Source Actuals"
        />
        <FormControlLabel
          control={<Checkbox checked={showForecasts} onChange={() => setShowForecasts(!showForecasts)} />}
          label="Show Forecasts"
        />
      </FormGroup>

      <ResponsiveContainer width="100%" height={450}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Year" />
          <YAxis label={{ value: 'TWh', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(value, name, props) => {
              const agencyMatch = agencyKeys.includes(props.dataKey);
              if (agencyMatch) {
                const label = agencyLabels[props.dataKey] || 'Agency Forecast';
                return [`${value.toFixed(1)}`, label];
              }
              const source = sourceKeys.find(s => s === props.dataKey);
              const yoy = source ? props.payload?.[`${props.dataKey}_yoy`] : null;
              return source ? [`${value.toFixed(1)}`, `${name} YoY: ${yoy}`] : value;
            }}
          />
          <Legend content={renderLegend} />

          <Line dataKey="Actual_Demand_TWh" name="Actual Demand" stroke="#24A148" strokeWidth={4} dot={false} />
          <Line dataKey="Forecast_Demand_TWh" name="Forecast Mean" stroke="rgba(0, 105, 180, 1)" strokeWidth={4} dot={false} />
          <Line dataKey="Forecast_Lower_TWh" name="Forecast -10%" stroke="rgba(255, 105, 180, 1)" strokeDasharray="4 2" strokeWidth={4} dot={false} />
          <Line dataKey="Forecast_Upper_TWh" name="Forecast +10%" stroke="rgba(255, 105, 180, 1)" strokeDasharray="4 2" strokeWidth={4} dot={false} />

          {showForecasts && agencyKeys.map((key, i) => (
            <Line
              key={key}
              dataKey={key}
              stroke="rgba(0, 0, 0, 0.3)"
              strokeWidth={2}
              dot={false}
              name=""
            />
          ))}

          {showSources && sourceKeys.map((key, index) => (
            <Line
              key={key}
              dataKey={key}
              stroke={sourceColors[index % sourceColors.length]}
              strokeWidth={3}
              strokeDasharray="3 2"
              dot={false}
              name={key.replace('_TWh', '').replace('_', ' ')}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default Chart1ForecastWithToggle;
