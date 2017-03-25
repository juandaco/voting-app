import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const PollCardChart = ({ pollTitle, chartData }) => {
  return (
    <div>
      <h4>{pollTitle}</h4>
      <Doughnut
        data={chartData}
        height={310}
        options={{
          maintainAspectRatio: true
        }}
      />
    </div>
  );
};

export default PollCardChart;
