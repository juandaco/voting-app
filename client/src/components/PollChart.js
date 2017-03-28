import React from 'react';
import { CardTitle } from 'react-mdl';
import { Doughnut } from 'react-chartjs-2';


const PollChart = ({ pollTitle, chartData }) => {
  return (
    <CardTitle
      expand
      style={{
        color: '#000'
      }}
    >
      <div>
        <h4>{pollTitle}</h4>
        <Doughnut
          data={chartData}
          height={310}
          options={{
            maintainAspectRatio: true,
            animation: false, // for Mobile??? */
          }}
        />
      </div>
    </CardTitle>
  );
};

export default PollChart;
