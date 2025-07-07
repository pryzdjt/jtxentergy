import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Example: Replace this with real data or import it
const data = [
  { year: '2018', Jan: 50, Feb: 52, Dec: 54 },
  { year: '2019', Jan: 55, Feb: 53, Dec: 57 },
  { year: '2020', Jan: 53, Feb: 54, Dec: 59 },
  { year: '2021', Jan: 60, Feb: 58, Dec: 61 },
  { year: '2022', Jan: 64, Feb: 62, Dec: 66 },
  { year: '2023', Jan: 68, Feb: 65, Dec: 70 }
];

const SeasonalDemandChart = () => (
  <ResponsiveContainer width="100%" height={400}>
    <LineChart data={data} margin={{ top: 30, right: 40, left: 10, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis label={{ value: 'Demand (TWh)', angle: -90, position: 'insideLeft' }} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="Jan" stroke="#8884d8" strokeWidth={2} />
      <Line type="monotone" dataKey="Feb" stroke="#82ca9d" strokeWidth={2} />
      <Line type="monotone" dataKey="Dec" stroke="#ff7300" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
);

export default SeasonalDemandChart;
