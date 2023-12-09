import React, { ChangeEvent, useState } from 'react';
import { Box, Button, Divider, FormControlLabel, IconButton, Radio, RadioGroup, Switch, TextField, Typography } from '@mui/material';
import ModalWrapper from '../../components/layout/ModalWrapper';
import colorConfigs from '../../config/colorConfigs';
import DomainNoticeBox from './DomainNoticeBox';
import { AppType, DomainType } from '../../models/DomainType';
import { activeStatus } from '../../enums/StatusEnum';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { getCookie } from '../../utils/cookie';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { authHeaders } from '../../utils/headers';
type Props = {
  isOpen: boolean,
  closeModal: any,
  app: AppType
}

const DomainUpdateModal = (props: Props) => {
  const [loading, setLoading] = useState(false);

  const [serverName, setServerName] = useState(props.app.server_name);
  const [ip, setIP] = useState(props.app.ip);
  const [port, setPort] = useState(props.app.port);
  const [version, setVersion] = useState(props.app.version?.toString());
  const [domainListName, setDomainName] = useState<DomainType[]>(props.app.domain_list);
  const [status, setStatus] = useState(props.app.status === activeStatus.enable ? true : false);

  const navigate = useNavigate();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVersion(event.target.value);
  };

  const app_id = getCookie("wf_app_id");
  const token = localStorage.getItem('token');
  const user_id = getCookie("user_id");

  function updateDomain() {
    setLoading(true);

    const url = process.env.REACT_APP_DB_HOST+'/app/' + app_id + '/domain-list?user_id=' + user_id;

    let jsonData = {
      id: props.app.id,
      server_id: props.app.server_id,
      ip: ip,
      port: port,
      version: version,
      status: status ? activeStatus.enable : activeStatus.disable,
      servername: serverName,
      domain_list: domainListName,
    };

    fetch(url, {
      method: 'put',
      headers: authHeaders,
      body: JSON.stringify(jsonData)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data['header']);
        // if (data['header']['isSuccessful'] !== true) {
        //   alert("다시 시도해주세요");
        // } else {
          window.location.reload();
        // }
      })
      .catch((error) => {
        console.error('요청 중 오류 발생:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function deleteDomain() {
    setLoading(true);

    const url = process.env.REACT_APP_DB_HOST+'/app/' + app_id + '/domain-list?user_id=' + user_id;

    let jsonData = {
      id: props.app.id,
      server_id: props.app.server_id,
      ip: ip,
      port: port,
      version: version,
      status: status ? activeStatus.enable : activeStatus.disable,
      servername: serverName,
      domain_list: domainListName,
    };

    fetch(url, {
      method: 'delete',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(jsonData)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data['header']['isSuccessful'] !== true) {
          alert("다시 시도해주세요");
        } else {
          const updatedDomainList = domainListName.filter(item => item.id !== props.app.id);
          setDomainName(updatedDomainList);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('요청 중 오류 발생:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const addInput = () => {
    if (domainListName.every((item) => item.domain !== '') && domainListName.length <= 5) {
      const newDomain = {
        domain: "",
        desc: ""
      };
      setDomainName([...domainListName, newDomain]);
    }
  };

  const removeInput = (index: number) => {
    if (domainListName.length === 1) return;
    const newInputValues = [...domainListName];
    newInputValues.splice(index, 1);
    setDomainName(newInputValues);
  };

  const handleInputChange = (index: number, value: string) => {
    const newInputValues = [...domainListName];
    newInputValues[index].domain = value;
    setDomainName(newInputValues);
  };

  const renderInputs = () => {
    return domainListName.map((item, index) => (
      <Box display="flex">
        <TextField
          fullWidth
          size='small'
          key={index}
          value={item.domain}
          onChange={(e) => handleInputChange(index, e.target.value)}
        />
        {/* <IconButton
          color="secondary"
          onClick={() => removeInput(index)}
          aria-label="delete"
        >
          <RemoveCircleOutlineIcon />
        </IconButton> */}
      </Box>
    ));
  };

  return (
    <ModalWrapper isOpen={props.isOpen} closeModal={props.closeModal}>
      <Box sx={{ padding: "20px", borderRadius: "24px" }}>
        <Typography variant='h6'>수정하기</Typography>
        <Divider sx={{
          marginTop: "8px",
          marginBottom: "16px",
          borderWidth: "1px",
          color: colorConfigs.noticeBoxBg
        }} />
        <DomainNoticeBox />
  
        <Box display="flex" padding="4px">
          <Typography width="20%">서버 이름</Typography>
          <Box width="80%" >
            <TextField fullWidth size='small' value={serverName} onChange={(e) => setServerName(e.target.value)}></TextField>
          </Box>
        </Box>
  
        <Box display="flex" padding="4px">
          <Typography width="20%">IP verion</Typography>
          <Box width="80%" >
            <RadioGroup
              row
              aria-label="version"
              name="version"
              value={version}
              onChange={handleChange}
            >
              <FormControlLabel value="ipv4" control={<Radio checked={version === "ipv4"} />} label="IPv4" />
              <FormControlLabel value="ipv6" control={<Radio checked={version === "ipv6"} />} label="IPv6" />
            </RadioGroup>
          </Box>
        </Box>
  
        <Box display="flex" padding="4px">
          <Typography width="20%">IP 주소</Typography>
          <Box width="80%" >
            <TextField fullWidth size='small' value={ip} onChange={(e) => setIP(e.target.value)}></TextField>
          </Box>
        </Box>
  
        <Box display="flex" padding="4px">
          <Typography width="20%">포트 번호</Typography>
          <TextField size='small' value={port} onChange={(e) => setPort(Number(e.target.value))}></TextField>
        </Box>
  
        <Box display="flex" padding="4px">
          <Typography width="20%">도메인 주소</Typography>
          <Box width="80%">
            {renderInputs()}
            {/* <Button onClick={addInput} >추가하기</Button> */}
          </Box>
        </Box>
  
        <Box display="flex" padding="4px" >
          <Typography width="20%">상태</Typography>
          <Switch defaultChecked checked={status} onChange={(e) => setStatus(e.target.checked)} />
        </Box>
  
        {/* Loading Spinner */}
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        )}
  
        <Box sx={{ float: "right", paddingBottom: "20px" }}>
          <Button
            sx={{
              color: colorConfigs.button.red,
              border: 1,
              borderColor: colorConfigs.button.red,
              borderRadius: "40px",
              paddingX: "32px",
              margin: "4px"
            }}
            onClick={deleteDomain}
            disabled={loading}
          >
            삭제하기
          </Button>
  
          <Button
            sx={{
              color: colorConfigs.button.white,
              backgroundColor: colorConfigs.button.blue,
              border: 1,
              borderColor: colorConfigs.button.blue,
              borderRadius: "40px",
              paddingX: "32px",
              margin: "4px",
              "&:hover": {
                color: colorConfigs.button.blue
              }
            }}
            onClick={updateDomain}
            disabled={loading}
          >
            수정하기
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  );  
};

export default DomainUpdateModal;
