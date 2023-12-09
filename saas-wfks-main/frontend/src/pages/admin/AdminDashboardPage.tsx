import React, { useEffect, useState } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import styleConfigs from '../../config/styleConfigs';
import { useDrawingArea } from '@mui/x-charts';
import { authHeaders } from '../../utils/headers';
import TrafficCtnBox from '../dashboard/component/TrafficCtnBox';
import { AttackType } from '../dashboard/component/AttackCntByNameBox';

type Props = {};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height * 4.5 / 10}>
      {children}
    </StyledText>
  );
}

const AdminDashBoardPage = (props: Props) => {
  const [cpuUsage, setCpuUsage] = useState(0);
  const [cpuPercent, setCpuPercent] = useState('0%');
  const [memoryPercent, setMemoryPercent] = useState('0%');
  const [memoryUsage, setMemoryUsage] = useState<number>(0.0);
  const [memoryFree, setMemoryFree] = useState(100.0);
  const [trafficList, setTrafficList] = useState<AttackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Updated this line

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(process.env.REACT_APP_DB_ADMIN + '/Pi5neer/dashboard/resource', {
        headers: authHeaders,
      }),
      fetch(process.env.REACT_APP_DB_ADMIN + '/Pi5neer/dashboard/traffic', {
        headers: authHeaders,
      }),
    ])
      .then(([resourceResponse, trafficResponse]) =>
        Promise.all([resourceResponse.json(), trafficResponse.json()])
      )
      .then(([resourceData, trafficData]) => {
        if (resourceData['header']['resultMessage'] === 'ok') {
          const percent = resourceData['result']['cpu_usage'];
          setCpuPercent(percent);
          var number = parseFloat(percent.split('%')[0]);
          setCpuUsage(number);

          resourceData = resourceData['result'];
          setMemoryPercent(resourceData['management_memory_usage']);
          number = parseFloat(
            resourceData['management_memory_used'].split(' MB')[0]
          );
          setMemoryUsage(number);
          number = parseFloat(
            resourceData['management_memory_free'].split(' MB')[0]
          );
          setMemoryFree(number);
        }

        if (trafficData['header']['resultMessage'] === 'ok') {
          setTrafficList(trafficData['result']['total']['traffic']);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("문제가 발생했습니다. 다시 시도해 주세요");
        setLoading(false);
      });
  }, []);

  return (
    <Box>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <>
          <Box display="flex">
            <Box
              sx={{
                boxShadow: styleConfigs.boxShadow,
                padding: '20px',
                borderRadius: '24px',
                margin: '12px',
                height: '220px',
              }}
            >
              <Typography variant="h6">CPU 사용량</Typography>
              <PieChart
                series={[
                  {
                    startAngle: -90,
                    endAngle: 90,
                    innerRadius: 60,
                    outerRadius: 80,
                    data: [
                      { label: '사용량', value: cpuUsage, color: '#3f51b5' },
                      { label: '남은 사용량', value: 100 - cpuUsage, color: '#F1EFFB' },
                    ],
                  },
                ]}
                margin={{ right: 5 }}
                width={300}
                height={300}
                slotProps={{
                  legend: { hidden: true },
                }}
              >
                <PieCenterLabel>{cpuPercent}</PieCenterLabel>
              </PieChart>
            </Box>

            <Box
              sx={{
                boxShadow: styleConfigs.boxShadow,
                padding: '20px',
                borderRadius: '24px',
                margin: '12px',
                height: '220px',
              }}
            >
              <Typography variant="h6">Memory 사용량</Typography>
              <PieChart
                series={[
                  {
                    startAngle: -90,
                    endAngle: 90,
                    innerRadius: 60,
                    outerRadius: 80,
                    data: [
                      { label: '사용량', value: memoryUsage, color: '#3f51b5' },
                      { label: '남은 사용량', value: memoryFree, color: '#F1EFFB' },
                    ],
                  },
                ]}
                margin={{ right: 5 }}
                width={300}
                height={300}
                slotProps={{
                  legend: { hidden: true },
                }}
              >
                <PieCenterLabel>{memoryPercent}</PieCenterLabel>
              </PieChart>
            </Box>
          </Box>
          <TrafficCtnBox data={trafficList} />
        </>
      )}
    </Box>
  );
};

export default AdminDashBoardPage;
