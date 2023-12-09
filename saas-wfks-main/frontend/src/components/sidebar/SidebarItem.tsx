import React from 'react'
import { RouteType } from '../../routes/config'
import { ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import colorConfigs from '../../config/colorConfigs';
import { RootState } from '../../utils/store';
import { useSelector } from 'react-redux';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

type Props = {
    item: RouteType;
}

const SidebarItem = ({ item }: Props) => {
    const {appState} = useSelector((state: RootState) => state.appState)
    return (
        item.sidebarProps && item.path ? (
            <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                    "&: hover": {
                        backgroundColor: appState === item.state ? colorConfigs.sidebar.activeBg :  colorConfigs.sidebar.hoverBg
                    },
                    backgroundColor : appState === item.state ? colorConfigs.sidebar.activeBg : "unset",
                    borderRadius : "8px",
                    paddingY: "8px",
                    paddingX: "12px"
                }}>

                <ListItemIcon sx={{
                    color: appState === item.state ? colorConfigs.sidebar.selectedColor : colorConfigs.sidebar.unselectedColor,
                }}> 
                    {item.sidebarProps.icon && item.sidebarProps.icon}
                </ListItemIcon>
                <ListItemText>
                    <Typography sx={{
                        color: appState === item.state ? colorConfigs.sidebar.selectedColor : colorConfigs.sidebar.unselectedColor
                    }}>
                        {item.sidebarProps.displayText}
                    </Typography>
                </ListItemText>
                {appState === item.state ? null : <KeyboardArrowRightIcon sx={{ color: colorConfigs.sidebar.unselectedColor}} />}
            </ListItemButton>
        ) : null
    )
}

export default SidebarItem