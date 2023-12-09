import { Box, Button, CircularProgress, Divider, Modal, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import colorConfigs from '../../../config/colorConfigs';
import { getCookie } from '../../../utils/cookie';
import { authHeaders } from '../../../utils/headers';
import { useNavigate } from 'react-router-dom';

type Props = {
  isOpen: boolean,
  closeModal: any
}

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

const BlockIpCreateModal = (props: Props) => {
  const navigate = useNavigate();
  const [ip, setIP] = useState('');
  const [subnetMask, setSubnetMask] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  const security_policy_id = getCookie("security_policy_id");
  const url = process.env.REACT_APP_DB_HOST+'/security_policy/' + security_policy_id + '/block_ip_filter/ip_list';

  const send_button = function () {
    setLoading(true);

    fetch(url, {
      method: 'post',
      headers: authHeaders,
      body: JSON.stringify({
        ip: ip,
        subnetmask: subnetMask.toString(),
        desc: desc
      })
    })
      .then((response) => response.json())
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
      onClose={props.closeModal}>
      <Stack sx={style} spacing={3}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          추가하기
        </Typography>
        <Divider />
        <TextField
          required
          id="outlined-required"
          label="block_ip"
          placeholder='차단 IP ex)0.0.0.0'
          onChange={(e) => setIP(e.target.value)}
        />
        <TextField
          required
          id="outlined-required"
          label="subnet_mask"
          placeholder='서브넷 마스크 ex)32'
          onChange={(e) => setSubnetMask(e.target.value)}
        />
        {/* <TextField
          required
          id="outlined-required"
          label="Reason"
          defaultValue="Just"
          placeholder='설명'
          onChange={(e) => setDesc(e.target.value)}
        /> */}
        <Box display="flex" justifyContent="flex-end">
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
            onClick={() => send_button()}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : '추가하기'}
          </Button>
        </Box>
      </Stack>
    </Modal>
  )
}

export default BlockIpCreateModal;
