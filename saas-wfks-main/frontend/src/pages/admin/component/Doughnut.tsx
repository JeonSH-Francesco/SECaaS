import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const DonutChart = ({ cpuUsage } : any) => {
  const data = {
    labels: ['사용 중', '남은 용량'],
    datasets: [
      {
        data: [cpuUsage, 100 - cpuUsage],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return <Doughnut data={data} />;
};

export default DonutChart;
