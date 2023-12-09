import { Box, Button, Divider, FormControlLabel, IconButton, Radio, RadioGroup, TextField, Typography, CircularProgress } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import ModalWrapper from '../../components/layout/ModalWrapper'
import colorConfigs from '../../config/colorConfigs'
import { DomainType } from '../../models/DomainType'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { activeStatus } from '../../enums/StatusEnum'
import DomainNoticeBox from './DomainNoticeBox'
import { getCookie } from '../../utils/cookie'
import { useNavigate } from 'react-router-dom'
import { authHeaders } from '../../utils/headers'

type Props = {
  isOpen: boolean,
  closeModal: any
}

const DomainCreateModal = ({ isOpen, closeModal }: Props) => {

  const navigate = useNavigate();
  const [serverName, setServerName] = useState('');
  const [ip, setIP] = useState('');
  const [port, setPort] = useState('');
  const [version, setVersion] = useState('');
  const [domainListName, setDomainName] = useState<DomainType[]>([{domain : '', desc : ''}]);
  const [loading, setLoading] = useState(false);

  const app_id = getCookie("wf_app_id");
  const user_id = getCookie("user_id");

  function createDomain() {
    const url = process.env.REACT_APP_DB_HOST+'/app/' + app_id + '/domain-list?user_id='+user_id;

    let jsonData = {
      ip: ip,
      port: port,
      version: version,
      status: activeStatus.enable,
      domain_list: domainListName,
      server_name: serverName
    }

    setLoading(true);

    fetch(url, {
      method: 'post',
      headers : authHeaders,
      body: JSON.stringify(jsonData)
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);

        if (data['header']['isSuccessful'] !== true) {
          alert("다시 시도해주세요");
        } else {
          closeModal();
          navigate("/customers/domain-settings");
        }
        window.location.reload();
      })
      .catch((error) => {
        setLoading(false);
        console.error('요청 중 오류 발생:', error);
      });
  }

  const handleChange = (event : ChangeEvent<HTMLInputElement>) => {
    setVersion(event.target.value);
  };

  const addInput = () => {
    if(domainListName.every((item) => item.domain !== '') && domainListName.length <= 5 ) {
      const newDomain = {
        domain : "",
        desc : ""
      }
      setDomainName([...domainListName, newDomain]);
    }
  };

  const removeInput = (index : number) => {
    if(domainListName.length === 1) return;
    const newInputValues = [...domainListName, ];
    newInputValues.splice(index, 1);
    setDomainName(newInputValues);
  };

  const handleInputChange = (index : number, value : string) => {
    const newInputValues = [...domainListName];
    newInputValues[index].domain = value
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
        <IconButton
          color="secondary"
          onClick={() => removeInput(index)}
          aria-label="delete">
          <RemoveCircleOutlineIcon />
        </IconButton>
      </Box>
    ));
  };

  return (
    <ModalWrapper isOpen={isOpen} closeModal={closeModal}>
      <Box sx={{
        padding : "20px",
        borderRadius : "40px",
      }}>
        <Typography variant='h6'>추가하기</Typography>
        <Divider sx={{
          marginTop : "8px",
          marginBottom : "16px",
          borderWidth : "1px",
          color : colorConfigs.noticeBoxBg
        }}/>
        <DomainNoticeBox />

        <Box display="flex" padding="4px">
          <Typography width="20%">서버 이름</Typography>
          <Box width="80%" >
            <TextField fullWidth size='small' value={serverName} onChange={(e) => setServerName(e.target.value)}></TextField>
          </Box>
        </Box>

        <Box display="flex" padding="4px">
          <Typography width="20%">IP 버전</Typography>
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
          <TextField size='small' value={port} onChange={(e) => setPort(e.target.value)}></TextField>
        </Box>

        <Box display="flex" padding="4px">
          <Typography width="20%">도메인 주소</Typography>
          <Box width="80%">
            {renderInputs()}
            <Button onClick={addInput} >추가하기</Button>
          </Box>
        </Box>

        <Box sx={{
          float : "right",
          paddingBottom : "20px"
        }}>
          <Button sx={{
            color : colorConfigs.button.white,
            backgroundColor : colorConfigs.button.blue,
            border : 1,
            borderColor : colorConfigs.button.blue,
            borderRadius : "40px",
            paddingX : "32px",
            margin : "4px",
            width : "180px",
            "&: hover" : {
              color : colorConfigs.button.blue
            }
          }}
          onClick={createDomain}
          disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : '추가하기'}
          </Button>
        </Box>
      </Box>
    </ModalWrapper>
  )
}

export default DomainCreateModal;
