import { Box, Button, Divider, Modal, Stack, TextField, Typography, CircularProgress } from '@mui/material'
import React, { useState } from 'react'
import colorConfigs from '../../../config/colorConfigs'
import { getCookie } from '../../../utils/cookie'
import { authHeaders } from '../../../utils/headers'
import { useNavigate } from 'react-router-dom'

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

const ApplyUrlCreateModal = (props: Props) => {

    const security_policy_id = getCookie("security_policy_id");
    const url = process.env.REACT_APP_DB_HOST+'/security_policy/' + security_policy_id + '/apply_url_list';

    const navigate = useNavigate();
    const [expUrl, setUrl] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false); // 추가

    const send_button = function () {
        setLoading(true); // 버튼 클릭 시 로딩 시작

        fetch(url, {
            method: 'post',
            headers: authHeaders,
            body: JSON.stringify([{
                url: expUrl,
                desc: desc
            }])
        }).then((response) => response.json())
            .then((data) => {
                setLoading(false); // 요청 완료 시 로딩 종료

                if (data['header']['isSuccessful'] !== true) {
                    alert("중복된 URL이 있는지 확인해 주세요");
                } else {
                    window.location.reload();
                }
            })
            .catch((error) => {
                setLoading(false); // 에러 발생 시 로딩 종료
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
                    label="예외 URL"
                    placeholder='예외 URL ex) /test/*'
                    onChange={(e) => setUrl(e.target.value)}
                />
                <TextField
                    label="설명"
                    placeholder='설명'
                    onChange={(e) => setDesc(e.target.value)}
                />
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
                            "&:hover": {
                                color: colorConfigs.button.blue
                            }
                        }}
                        onClick={() => { send_button() }}
                        disabled={loading} // 로딩 중일 때 버튼 비활성화
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : '추가하기'}
                    </Button>
                </Box>
            </Stack>
        </Modal>
    )
}

export default ApplyUrlCreateModal
