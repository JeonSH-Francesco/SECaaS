import { Box, Button, Divider, Modal, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import colorConfigs from '../../../config/colorConfigs'
import { getCookie } from '../../../utils/cookie'
import { authHeaders } from '../../../utils/headers'
import { useNavigate } from 'react-router-dom'
import { URLType } from '../../../models/URLType'

type Props = {
  isOpen : boolean,
  closeModal : any,
  excepUrl? : URLType 
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

const ExcepUrlUpdateModal = (props: Props) => {

  const navigate = useNavigate();
  const [expUrl, setUrl] = useState(props.excepUrl?.url);
  const [desc, setDesc] = useState(props.excepUrl?.desc);

  useEffect(() => {
    setUrl(props.excepUrl?.url);
    setDesc(props.excepUrl?.desc);
  }, [props.excepUrl]);

  const security_policy_id = getCookie("security_policy_id");
  const url = process.env.REACT_APP_DB_HOST+'/security_policy/' + security_policy_id + '/exception_url_list';

  const updateExcpUrl = function () {
    fetch(url, {
      method: 'put',
      headers : authHeaders,
      body: JSON.stringify([{
        id : props.excepUrl?.id,
        url : expUrl,
        desc : desc
      }])
    }).then((response) => response.json())
      .then((data) => {
        if (data['header']['isSuccessful'] !== true) {
          alert("중복된 URL이 있는지 확인해 주세요")
        } else {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error('요청 중 오류 발생:', error);
      });
  }

  const deleteExcpUrl = function () {
    fetch(url, {
      method: 'delete',
      headers : authHeaders,
      body: JSON.stringify([{
        id : props.excepUrl?.id,
      }])
    }).then((response) => response.json())
      .then((data) => {
        if (data['header']['isSuccessful'] !== true) {
          alert("다시 시도해주세요");
        } else {
            window.location.reload();
        }
      })
      .catch((error) => {
        console.error('요청 중 오류 발생:', error);
      });
  }

  return (
    <Modal
        open={props.isOpen}
        onClose={props.closeModal}>
        <Stack sx={style} spacing={3}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            수정하기
          </Typography>
          <Divider />
          <TextField
            label="예외 URL"
            placeholder='예외 URL ex) /test/*'
            value={expUrl}
            onChange={(e) => setUrl(e.target.value)}
          />
          <TextField
            label="설명"
            placeholder='설명'
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button sx={{
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
            }} onClick={() => deleteExcpUrl()} >
              삭제하기
            </Button>

            <Button sx={{
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
              onClick={() => updateExcpUrl()}
            >수정하기</Button>
          </Box>
        </Stack>
      </Modal>
  )
}

export default ExcepUrlUpdateModal