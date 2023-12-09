import { Box, Typography } from '@mui/material'
import React from 'react'
import styleConfigs from '../../../config/styleConfigs'
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import colorConfigs from '../../../config/colorConfigs'

type Props = {
    data: AttackType[]
}

export type AttackType = {
    name?: string;
    count?: number;
    interval?: string;
  };
  
  // Modify the color calculation to use count directly
  const getChartColor = (count: number): string => {
    if (count >= 75) {
      return colorConfigs.chart.high;
    } else if (count >= 50) {
      return colorConfigs.chart.medium;
    } else {
      return colorConfigs.chart.low;
    }
  };
  
  const AttackCntByNameBox = (props: Props) => {
    return (
      <Box
        sx={{
          flex: '1',
          borderRadius: '20px',
          padding: '20px',
          margin: '20px',
          boxShadow: styleConfigs.boxShadow,
        }}
      >
        <Typography sx={{ fontWeight: '700' }}>공격 이름</Typography>
        <BarChart
            width={500}
            height={300}
            data={props.data}
            margin={{ top: 20, right: 30, left: 50, bottom: 5 }} // Adjust left margin to make space for y-axis labels
            layout='vertical'
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} /> {/* Rotate and adjust width */}
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={colorConfigs.chart.medium} label="공격 시도 횟수" />
            </BarChart>
      </Box>
    );
  };
  
  export default AttackCntByNameBox;