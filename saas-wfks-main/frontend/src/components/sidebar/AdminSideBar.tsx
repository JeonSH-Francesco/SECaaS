import React from 'react'
import { RouteType } from '../../routes/config';
import appRoutes from '../../routes/appRoutes';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Typography } from '@mui/material';
import sizeConfigs from '../../config/sizeConfigs';
import colorConfigs from '../../config/colorConfigs';
import SidebarItem from './SidebarItem';
import { useNavigate } from 'react-router-dom';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import styleConfigs from '../../config/styleConfigs';
import SidebarItemCollapse from './SidebarItemCollapse';

type Props = {}

const SideBarAdmin = (props: Props) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
 
       try {
          const token = localStorage.getItem('token');
 
          if (token) {
             // Make a request to your backend for logout
             const response = await fetch(process.env.REACT_APP_DB_HOST+`/users/logout`, {
                method: 'POST', // or 'GET' or whatever your backend expects
                headers: {
                   Authorization: `Bearer ${token}`,
                   'Content-Type': 'application/json',
                },
             });
 
             if (!response.ok) {
                console.error('Error logging out:', response.status, response.statusText);
             }
          }
          localStorage.removeItem('token');
          navigate('/user/signin');
       } catch (error) {
          console.error('Error logging out:', error);         
       }
    };
 
    const admins: RouteType[] = appRoutes.appAdminRoutes;
 
    return (
       <Drawer 
          variant="permanent"
          sx={{
             width: sizeConfigs.sidebar.width,
             flexShrink: 0,
             "& .MuiDrawer-paper": {
                width: sizeConfigs.sidebar.width,
                padding: "12px",
                boxSizing: "border-box",
                borderRight: "0px",
                backgroundColor: colorConfigs.sidebar.bg,
                color: colorConfigs.sidebar.unselectedColor,
                borderRadius: "24px",
                boxShadow: styleConfigs.boxShadow
             }
          }}>
          <List disablePadding>
             <Toolbar sx={{marginBottom: "8px", marginTop: "8px"}}>
                <Stack 
                   sx={{width: "100px", color: colorConfigs.logo.color}}
                   direction="row"
                   justifyContent="center">
                   <AcUnitIcon/>
                   <Box sx={{marginLeft: "12px"}}>
                      <Typography variant='h5'>
                         4조
                      </Typography>
                   </Box>
                </Stack>
             </Toolbar>
             {admins ? admins.map((route, index) => (
               route.sidebarProps ? (
                  route.child ? (
                     <SidebarItemCollapse item={route} key={index} />
                  ) : (
                     <SidebarItem item={route} key={index} />
                  )
               ) : null
            )) : null }
             <ListItemButton
                onClick={handleLogout}
                sx={{
                   "&:hover": {
                      backgroundColor: colorConfigs.sidebar.hoverBg,
                   },
                   borderRadius: "8px",
                   paddingY: "8px",
                   paddingX: "12px",
                }}>

                  

                <ListItemIcon>
                   <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText
                   disableTypography
                   primary={<Typography>Logout</Typography>}
                />
             </ListItemButton>
          </List>
       </Drawer>
    );
}

export default SideBarAdmin