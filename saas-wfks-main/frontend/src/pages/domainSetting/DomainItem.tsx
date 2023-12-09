import React, { useState } from 'react'
import { AppType } from '../../models/DomainType'
import { Box, IconButton, Typography } from '@mui/material'
import styleConfigs from '../../config/styleConfigs'
import colorConfigs from '../../config/colorConfigs'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { activeStatus } from '../../enums/StatusEnum'
import DomainUpdateModal from './DomainUpdateModal'

type Props = {
    app: AppType
}

const DomainItem = ({ app }: Props) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <Box
            sx={{
                justifyContent: 'space-between',
                display : "flex",
                minWidth : "440px",
                maxWidth : "470px",
                flex : 1,
                margin : "20px",
                padding: "25px 40px",
                borderRadius: "24px",
                marginTop: "18px",
                marginBottom: "18px",
                boxShadow: styleConfigs.boxShadow
            }}>
            <Box>
                <Box sx={{ justifyContent: "space-between", display: "flex", minWidth: "470px", }}>
                    <Box>
                    <Typography variant='h5' sx={{ paddingBottom: "12px" }}>{app.server_name} </Typography>
                    </Box>
                    <IconButton sx={{
                        width: "60px",
                        height: "60px"
                    }} onClick={openModal}>
                        <DriveFileRenameOutlineIcon />
                    </IconButton>
                </Box>
                <Box display="flex" sx={{paddingY : "6px"}}>
                    <Typography sx={{ width: "130px", fontWeight: '600'}}> IP 주소 </Typography>
                    <Typography>{app.ip}:{app.port}</Typography>
                </Box>
                {app.domain_list.map((item, index) => (
                    <Box display="flex">
                        {index === 0
                            ? <Typography sx={{ width: "130px", fontWeight : "600" }}>도메인 주소</Typography>
                            : <Typography sx={{ width: "130px" }} />}
                        <Typography>{item.domain}</Typography>
                    </Box>
                ))}
                <Box display="flex" sx={{paddingY : "6px"}} >
                    <Typography sx={{width: "130px", fontWeight: '600'}}> 상태 </Typography>
                    {app.status === activeStatus.enable
                        ? <Typography color={colorConfigs.stauts.enable} >활성화</Typography>
                        : <Typography color={colorConfigs.stauts.disable} >비활성화</Typography>
                    }
                </Box>
            </Box>
            
            <DomainUpdateModal isOpen={isModalOpen} closeModal={closeModal} app={app} />
        </Box>
    )
}

export default DomainItem