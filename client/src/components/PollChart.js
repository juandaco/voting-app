import React from 'react';
import { CardTitle } from 'react-mdl';
import { Doughnut } from 'react-chartjs-2';

const PollChart = ({ pollTitle, chartData }) => {
  return (
    <CardTitle
      expand
      style={{
        color: '#000',
        marginTop: -40,
      }}
    >
      <div
        style={{
          marginLeft: -5,
        }}
      >
        <h4 style={{ marginLeft: 10 }}>{pollTitle}</h4>
        <Doughnut
          data={chartData}
          height={260}
          width={260}
          options={{
            animation: false, // for Mobile??? */
          }}
        />
      </div>
    </CardTitle>
  );
};

export default PollChart;
