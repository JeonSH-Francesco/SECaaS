import React from 'react';
import { Outlet } from 'react-router-dom'
import { Box, Toolbar } from "@mui/material"
import TopBar from '../sidebar/TopBar'
import sizeConfigs from '../../config/sizeConfigs';
import colorConfigs from '../../config/colorConfigs';
import SideBar from '../sidebar/SideBar';
import AdminSideBar from '../sidebar/AdminSideBar';

const AdminMainLayout = () => {

    return (
        <Box sx={{ display: "flex" }}>
            <TopBar />
            <Box component="nav" sx={{ width: sizeConfigs.sidebar.width, flexShrink: 0 }}>
                <AdminSideBar />
            </Box>
            <Box component="main" sx={{
                flexGrow: 1,
                p: 3,
                width: `calc(100% - ${sizeConfigs.sidebar.width})`,
                minHeight: "100vh",
                backgroundColor: colorConfigs.mainBg
            }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    )
}

export default AdminMainLayout; 