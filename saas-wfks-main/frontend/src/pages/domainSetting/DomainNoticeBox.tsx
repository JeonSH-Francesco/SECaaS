import { Box, Typography } from '@mui/material'
import React from 'react'
import colorConfigs from '../../config/colorConfigs'

const DomainNoticeBox = () => {
    // TODO : 멘트 수정
    return (
        <Box sx={{
            backgroundColor: colorConfigs.noticeBoxBg,
            padding: "20px",
            marginBottom: "20px",
            borderRadius: "24px",
        }}>
            <Typography sx={{
                fontSize: "16px",
                margin: "4px"
            }}>
                💡 도메인 설정 시 유의 사항
            </Typography>
            <Typography sx={{
                fontSize: "14px",
                marginLeft: "24px"
            }}>
                DNS 서버의 IP를 43.200.213.102:8443로 <br />
                도메인을 wf.awstest.piolink.net로 업데이트해야 합니다.
            </Typography>
        </Box>
    )
}

export default DomainNoticeBox