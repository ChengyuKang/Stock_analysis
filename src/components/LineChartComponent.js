// src/components/LineChartComponent.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ data, dataKeyX, dataKeyY, yAxisLabel }) => {
  const formatXAxis = (tickItem) => {
    // Convert Unix timestamp to a readable date format (e.g., "MM/DD/YYYY")
    const date = new Date(tickItem * 1000); // Multiply by 1000 to convert seconds to milliseconds
    return date.toLocaleDateString(); // Format the date as "MM/DD/YYYY"
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          tickFormatter={formatXAxis} // Use the formatter for the X-axis
          label={{ value: dataKeyX, position: 'insideBottomRight', offset: 0 }}
        />
        <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
        <Tooltip labelFormatter={formatXAxis} />
        <Legend />
        <Line type="monotone" dataKey={dataKeyY} stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
