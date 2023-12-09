import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import AttackCntByNameBox from './component/AttackCntByNameBox';
import AttackCntByTimeBox from './component/AttackCntByTimeBox';
import TrafficCtnBox from './component/TrafficCtnBox';
import { getCookie } from '../../utils/cookie';
import Grid from '@mui/material/Grid';
import { IoIosRefresh } from "react-icons/io";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { authHeaders } from '../../utils/headers';

export type AttackType = {
  name?: string;
  count?: number;
  value?: number;
  interval?: string;
};
const app_id = getCookie('wf_app_id');
const app_name = getCookie('app_name');
const token = localStorage.getItem('token');

const DashboardPage = () => {
  const url = process.env.REACT_APP_DB_HOST+`/app/${app_id}/dashboard?app_name=${app_name}`;
  const [loading, setLoading] = useState(false);
  const [trafficList, setTrafficList] = useState<AttackType[]>([]);
  const [attackByTimeList, setAttackByTimeList] = useState<AttackType[]>([]);
  const [attackByNameList, setAttackByNameList] = useState<AttackType[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        headers: authHeaders
      });

      if (response.ok) {
        const data = await response.json();
        setTrafficList(data['tarffic']);
        setAttackByTimeList(data['detect_attack']);
        setAttackByNameList(
          Object.entries(data['attack_name']).map(([name, value]) => ({
            name,
            value: value as number,
          }))
        );
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const handleRefreshLogs = () => {
    fetchData();
  };

  const text_style2 = {
    fontSize: '20px',
  };

  return (
    <Box>
      <Grid container>
        <Grid item style={{ marginLeft: 'auto' }}>
          <Button
            variant="outlined"
            style={{ margin: '10px' }}
            startIcon={<IoIosRefresh />}
            onClick={handleRefreshLogs}
          >
            <Typography style={text_style2}>
              Refresh Logs
            </Typography>
          </Button>
        </Grid>
      </Grid>

      {/* Display loading indicator if data is being fetched */}
      {loading && <CircularProgress style={{ margin: '20px' }} />}

      {/* Display data if not loading */}
      {!loading && (
        <>
          {/* Traffic Statistics */}
          <TrafficCtnBox data={trafficList} />

          {/* Attack Count by Time and Attack Count by Name */}
          <Box display="flex">
            <AttackCntByTimeBox data={attackByTimeList} />
            <AttackCntByNameBox data={attackByNameList} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default DashboardPage;
