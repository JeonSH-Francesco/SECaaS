import React, { useEffect, useState } from 'react'
import ActiveStatusBox from './component/ActiveStatusBox';
import { Box, Button, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import colorConfigs from '../../config/colorConfigs';
import { getCookie } from '../../utils/cookie';
import { authHeaders } from '../../utils/headers';

type Props = {
  name: string,
}

const RequestFloodPage = (props: Props) => {

  const security_policy_id = getCookie("security_policy_id");
  const url = process.env.REACT_APP_DB_HOST+`/security_policy/${security_policy_id}/request_flood`;

  const [status, setStatus] = useState('');
  const [sessionCnt, setSessionCnt] = useState('');
  const [proxyCnt, setProxyCnt] = useState('');

  const handleSessionChange = (event: SelectChangeEvent) => {
    setSessionCnt(event.target.value);
  };
  const handleProxyChange = (event: SelectChangeEvent) => {
    setProxyCnt(event.target.value);
  };

  useEffect(() => {
    fetch(url, {
      headers : authHeaders,
    })
      .then((response) => response.json())
      .then((data) => {
        setStatus(data['result']['status']);
        setSessionCnt(data['result']['adv_options']['session_request_count']);
        setProxyCnt(data['result']['adv_options']['proxy_request_count']);
      })
      .catch((error) => {
        console.error('요청 중 오류 발생:', error);
      });
  }, [url]);


  function handleStatusChange(value: string) {
    setStatus(value);
    fetch(url, {
      method: 'put',
      headers: authHeaders,
      body: JSON.stringify({ status: value })
    })
      .then((response) => response.json())
      .then((data) => {
        if(data['header']['resultMessage'] === 'ok')
          setStatus(value);
      })
      .catch((error) => {
        console.error('요청 중 오류 발생:', error);
      });
  };

  function updateCnt() {
    fetch(url + '/adv_options', {
      headers : authHeaders,
      method: 'put',
      body: JSON.stringify({ 
        session_user_define_time: 3000,
        proxy_user_define_time: 3000,
        proxy_time_unit: "second",
        session_time_unit: "second",
       })
    })
      .then((response) => response.json())
      .catch((error) => {
        alert('오류가 발생했습니다. 관리자에게 문의해 주세요')
        console.error('요청 중 오류 발생:', error);
      });
  };

  return (
    <Box>
      <Box >
        <ActiveStatusBox name={props.name} status={status} onValueChange={handleStatusChange} />
        <Box display="flex" sx={{ alignItems: "center", margin: "20px" }}>
          <Typography width="15%" sx={{ fontWeight: "600", fontSize: "17px" }}>세션 요청 횟수</Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
              displayEmpty
              value={sessionCnt}
              label="Age"
              onChange={handleSessionChange}>
              <MenuItem defaultChecked value={10}>10회</MenuItem>
              <MenuItem value={50}>50회</MenuItem>
              <MenuItem value={100}>100회</MenuItem>
              <MenuItem value={500}>500회</MenuItem>
              <MenuItem value={1000}>1000회</MenuItem>
            </Select>
          </FormControl>
          <Typography width="20%">/ 5분</Typography>
        </Box>

        <Box display="flex" sx={{ alignItems: "center", margin: "20px" }}>
          <Typography width="15%" sx={{ fontWeight: "600", fontSize: "17px" }}>프록시 요청 횟수</Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
              value={proxyCnt}
              label="Age"
              onChange={handleProxyChange}>
              <MenuItem defaultChecked value={100}>100회</MenuItem>
              <MenuItem value={500}>500회</MenuItem>
              <MenuItem value={1000}>1000회</MenuItem>
              <MenuItem value={5000}>5000회</MenuItem>
              <MenuItem value={10000}>10000회</MenuItem>
            </Select>
          </FormControl>
          <Typography width="20%">/ 5분</Typography>
        </Box>
      </Box>

      <Box sx={{
        position: 'fixed',
        float: "right",
        bottom: '40px',
        right: '40px',
      }}>
        <Button
          sx={{
            minWidth: "180px",
            color: colorConfigs.button.white,
            backgroundColor: colorConfigs.button.blue,
            border: 1,
            borderColor: colorConfigs.button.blue,
            borderRadius: "40px",
            paddingX: "32px",
            margin: "4px",
            "&: hover": {
              color: colorConfigs.button.blue
            }
          }}
          onClick={updateCnt}
        >적용하기</Button>
      </Box>
    </Box>
  )
}

export default RequestFloodPage