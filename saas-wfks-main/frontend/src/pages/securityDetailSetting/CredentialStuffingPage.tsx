import React, { useEffect, useState } from 'react'
import ActiveStatusBox from './component/ActiveStatusBox';
import { Box } from '@mui/material';
import { getCookie } from '../../utils/cookie';
import { authHeaders } from '../../utils/headers';

type Props = {
  name : string,
}

const CredentialStuffingPage = (props: Props) => {

    const security_policy_id = getCookie("security_policy_id");
    const url = process.env.REACT_APP_DB_HOST+`/security_policy/${security_policy_id}/credential_stuffing`;
    
    const [status, setStatus] = useState('');
  
    useEffect(() => {
      fetch(url, {headers : authHeaders})
        .then((response) => response.json())
        .then((data) => {
          setStatus(data['result']['status']);
        })
        .catch((error) => {
          console.error('요청 중 오류 발생:', error);
        });
    }, [url]);

    function handleValueChange(value: string) {
      setStatus(value);
      fetch(url, {
        method : 'put', 
        headers: authHeaders,
        body : JSON.stringify({status : value})})
        .then((response) => response.json())
        .then((data) => {
          if(data['header']['resultMessage'] === 'ok')
          setStatus(value);
        })
        .catch((error) => {
          console.error('요청 중 오류 발생:', error);
        });
    };
  
  
    return (
      <Box>
        <Box>
          <ActiveStatusBox name={props.name} status={status} onValueChange={handleValueChange} />
        </Box>
      </Box>
    )
}

export default CredentialStuffingPage