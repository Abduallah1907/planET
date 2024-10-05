import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './AdminDash.css';

Chart.register(...registerables);

const data = {
  labels: ['5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k'],
  datasets: [
    {
      label: 'User Coverage',
      data: [20, 35, 50, 64, 40, 60, 45, 55, 65, 70, 60, 55],
      fill: true,
      backgroundColor: 'rgba(255,123,51,0.2)',
      borderColor: '#ff7b33',
      tension: 0.1,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const UserCoverageChart = () => {
  return (
    <div className="chart-container">
      <h4 className='dashl'>User Coverage</h4>
      <Line data={data} options={options} />
    </div>
  );
};

export default UserCoverageChart;
