import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef} from '@mui/x-data-grid';
import { Grid, CircularProgress } from '@mui/material';
import { getCookie } from '../../utils/cookie';
import { IoIosRefresh } from 'react-icons/io';

type Props = {};

interface SecurityLog {
  id: number;
  timestamp: string;
  total_duplicates: string;
  host: string;
  attacker_ip: string;
  server_ip_port: string;
  url: string;
  risk_level: string;
  category: string;
  action: string;
}

const app_id = getCookie('wf_app_id');
const token = localStorage.getItem('token');;
const app_name = getCookie('app_name');

const columns: GridColDef[] = [
  { field: 'timestamp', headerName: '시간', width: 250, align: 'left' },
  { field: 'total_duplicates', headerName: '감지된 요청 수', width: 170, align: 'left' },
  { field: 'host', headerName: '도메인', width: 170, align: 'left' },
  { field: 'attacker_ip', headerName: '공격자 IP', width: 200, align: 'left' },
  { field: 'server_ip_port', headerName: '서버 IP/PORT', width: 200, align: 'left' },
  { field: 'url', headerName: 'URL', width: 250, align: 'left' },
  { field: 'risk_level', headerName: '공격 위험 수준', width: 200, align: 'left' },
  { field: 'category', headerName: '분류', width: 150, align: 'left' },
  { field: 'action', headerName: '처리 상태', width: 180, align: 'left' },
];

const SecurityLogPage = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [menuItems, setMenuItems] = useState<string[]>([]);
  const app_id = getCookie('wf_app_id');
  const [selectedHost, setSelectedHost] = useState<number | string>(0);

  const fetchDataFromBackend = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_DB_HOST+`/app/${app_id}/logs?app_name=${app_name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      setSecurityLogs(data.database_logs);

      // Assuming the data structure is { "hosts": [...] }
      const hosts = data.hosts || [];
      setMenuItems(['----------[선택]----------', ...hosts]);
    } catch (error) {
      console.error('Error fetching data from backend:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromBackend();
  }, [app_id]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedHost(Number(event.target.value));
  };

  const handleRefreshLogs = async () => {
    try {
      const response = await fetch(`/app/${app_id}/logs/refresh?app_name=${app_name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Logs refreshed successfully!');
        // Fetch data again after refreshing
        await fetchDataFromBackend();
      } else {
        console.error('Failed to refresh logs.');
      }
    } catch (error) {
      console.error('Error during refresh:', error);
    }
  };

  const text_style = {
    fontSize: '20px',
    fontWeight: 'bold',
  };

  const text_style2 = {
    fontSize: '20px',
  };

  return (
    <Box>
      <Grid container spacing={2} marginBottom={2} alignItems="center">
        <Typography variant="body1" style={{ marginLeft: '20px', fontSize: '20px', fontWeight: 'bold' }}>
          로그 :
        </Typography>
        <Grid item style={{ marginLeft: 'auto' }}>
          <Button
            variant="outlined"
            style={{ margin: '10px' }}
            startIcon={<IoIosRefresh />}
            onClick={handleRefreshLogs}
          >
            <Typography style={text_style2}>Refresh Logs</Typography>
          </Button>
        </Grid>
      </Grid>
      <Box>
        {loading ? (
          <CircularProgress style={{ margin: '20px' }} />
        ) : (
          <div style={{ height: 700, width: '100%' }}>
            <DataGrid
              rows={securityLogs}
              columns={columns}
              getRowId={(row) => row.no.toString()} // assuming 'no' is the unique identifier
              pageSizeOptions={[5, 10]}
            />
          </div>
        )}
      </Box>
    </Box>
  );
};

export default SecurityLogPage;
