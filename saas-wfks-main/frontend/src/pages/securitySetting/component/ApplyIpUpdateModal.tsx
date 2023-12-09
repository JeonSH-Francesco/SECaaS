import { Box, Button, CircularProgress, Divider, Modal, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import colorConfigs from '../../../config/colorConfigs';
import { getCookie } from '../../../utils/cookie';
import { authHeaders } from '../../../utils/headers';
import { ExceptionIpType } from '../../../models/ExceptionIpType';

type Props = {
  isOpen: boolean,
  closeModal: any,
  excepIp?: ExceptionIpType
};

const style = {
  position: 'absolute' as 'absolute',
  top: '45%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  m: '2rem'
};

const ApplyIpUpdateModal = (props: Props) => {
  const [version, setVersion] = useState(props.excepIp?.version);
  const [client_ip, setClientIP] = useState(props.excepIp?.client_ip);
  const [client_mask, setClientMask] = useState(props.excepIp?.client_mask);
  const [desc, setDesc] = useState(props.excepIp?.desc);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVersion(props.excepIp?.version);
    setClientIP(props.excepIp?.client_ip);
    setClientMask(props.excepIp?.client_mask);
    setDesc(props.excepIp?.desc);
  }, [props.excepIp]);

  const security_policy_id = getCookie("security_policy_id");
  const url = process.env.REACT_APP_DB_HOST+'/security_policy/' + security_policy_id + '/apply_ip_list';

  const updateExcpIp = function () {
    setLoading(true);

    fetch(url, {
      method: 'put',
      headers: authHeaders,
      body: JSON.stringify([{
        id: props.excepIp?.id,
        version: version,
        client_ip: client_ip,
        client_mask: client_mask,
        desc: desc
      }])
    }).then((response) => response.json())
      .then((data) => {
        setLoading(false);

        if (data['header']['isSuccessful'] !== true) {
          alert("중복된 IP이 없는지 확인해 주세요");
        } else {
          window.location.reload();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('요청 중 오류 발생:', error);
      });
  }

  const deleteExcpIp = function () {
    setLoading(true);

    fetch(url, {
      method: 'delete',
      headers: authHeaders,
      body: JSON.stringify([{
        id: props.excepIp?.id,
      }])
    }).then((response) => response.json())
      .then((data) => {
        setLoading(false);

        if (data['header']['isSuccessful'] !== true) {
          alert("다시 시도해주세요");
        } else {
          window.location.reload();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error('요청 중 오류 발생:', error);
      });
  }

  return (
    <Modal
      open={props.isOpen}
      onClose={props.closeModal}
    >
      <Stack sx={style} spacing={3}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          수정하기
        </Typography>
        <Divider />
        <TextField
          label="적용 IP"
          placeholder='적용 Ip ex)0.0.0.0'
          value={client_ip}
          onChange={(e) => setClientIP(e.target.value)}
        />
        <TextField
          label="서브넷 마스크"
          placeholder='서브넷 마스크 ex)32'
          value={client_mask}
          onChange={(e) => setClientMask(e.target.value)}
        />
        <TextField
          label="설명"
          placeholder='설명'
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <Box display="flex" justifyContent="flex-end">
          <Button
            sx={{
              color: colorConfigs.button.red,
              border: 1,
              borderColor: colorConfigs.button.red,
              borderRadius: "40px",
              paddingX: "32px",
              margin: "4px",
              width: "130px",
              "&: hover": {
                color: colorConfigs.button.white,
                background: colorConfigs.button.red,
              }
            }}
            onClick={() => deleteExcpIp()}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : '삭제하기'}
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
              width: "130px",
              "&: hover": {
                color: colorConfigs.button.blue
              }
            }}
            onClick={() => updateExcpIp()}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : '수정하기'}
          </Button>
        </Box>
      </Stack>
    </Modal>
  )
}

export default ApplyIpUpdateModal;
