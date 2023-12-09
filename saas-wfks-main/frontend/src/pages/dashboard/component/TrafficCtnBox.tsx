import React from 'react';
import { AttackType } from '../../../models/AttackType';
import { Box, Typography } from '@mui/material';
import styleConfigs from '../../../config/styleConfigs';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

type Props = {
  data: AttackType[];
};

const TrafficCtnBox = (props: Props) => {
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
      <Typography sx={{ fontWeight: '700' }}>월별 트래픽 통계</Typography>
      <LineChart width={1000} height={300} data={props.data} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="interval" tick={false} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </LineChart>
    </Box>
  );
};

export default TrafficCtnBox;
