import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import colorConfigs from '../../../config/colorConfigs';

export type AttackType = {
  name?: string;
  count?: number;
  value?: number;
  interval?: string;
};

interface UserApplicationLogsProps {
  time_data: AttackType[]; // Update the type
  name_data: AttackType[]; // Keep the same type for name_data
  loading: boolean;
}

const UserApplicationLogs: React.FC<UserApplicationLogsProps> = ({ time_data, name_data, loading }) => {
  return (
    <Box display="flex" flexDirection="row">
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* Bar Chart for name_data */}
          <Box>
            <BarChart
              width={1000}
              height={300}
              data={name_data}
              margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={colorConfigs.chart.medium} label="공격 시도 횟수" />
            </BarChart>
          </Box>

          {/* Bar Chart for time_data */}
          {/* <Box>
            <BarChart
              width={500}
              height={300}
              data={time_data}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="interval" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </Box> */}
        </>
      )}
    </Box>
  );
};

export default UserApplicationLogs;