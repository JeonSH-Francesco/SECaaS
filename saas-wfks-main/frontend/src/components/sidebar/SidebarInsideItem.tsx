import React from 'react'
import { RouteType } from '../../routes/config'
import { useSelector } from 'react-redux'
import { RootState } from '../../utils/store'
import { ListItemButton, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import colorConfigs from '../../config/colorConfigs'

type Props = {
    item: RouteType
}

const SidebarInsideItem = ({ item }: Props) => {
    const { appState } = useSelector((state: RootState) => state.appState)
    return (
        item.sidebarProps && item.path ? (
            <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                    paddingLeft: "60px",
                    paddingBottom: "4px", paddingTop: "4px"
                }}>
                <Typography sx={{
                    color: colorConfigs.sidebar.unselectedColor,
                    textDecoration: appState.split(".")[1] === item.state.split(".")[1] ? "underline" : "none",
                    fontWeight: appState.split(".")[1] === item.state.split(".")[1] ? "700" : "400",
                    fontSize : "14px"
                }}>
                    {item.sidebarProps.displayText}
                </Typography>
            </ListItemButton>
        ) : null
    )
}

export default SidebarInsideItem