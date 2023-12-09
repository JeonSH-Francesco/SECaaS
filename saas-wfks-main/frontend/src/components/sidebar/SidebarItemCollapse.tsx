import React, { useEffect, useState } from 'react'
import { RouteType } from '../../routes/config'
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import colorConfigs from '../../config/colorConfigs'
import { RootState } from '../../utils/store'
import { useSelector } from 'react-redux'
import SidebarInsideItem from './SidebarInsideItem'

type Props = {
    item: RouteType
}

const SidebarItemCollapse = ({ item }: Props) => {

    const [open, setOpen] = useState(false);
    const { appState } = useSelector((state : RootState) => state.appState)

    useEffect (() => {

        if(appState.includes(item.state)) {
            setOpen(true);
        }
    }, [appState, item])

    return (
        item.sidebarProps ? (
            <>
                <ListItemButton
                    onClick={() => setOpen(!open)}
                    sx={{
                        "&: hover": {
                            backgroundColor: colorConfigs.sidebar.hoverBg
                        },
                        borderRadius : "8px",
                        paddingY: "8px",
                        paddingX: "12px"
                        
                    }}>

                    <ListItemIcon sx={{
                        color: colorConfigs.sidebar.unselectedColor
                    }}>
                        {item.sidebarProps.icon && item.sidebarProps.icon}
                    </ListItemIcon>
                    <ListItemText disableTypography primary={
                        <Typography>
                            {item.sidebarProps.displayText}
                        </Typography>
                    }/>
                    
                </ListItemButton>
                <Collapse in={open} timeout="auto">
                    <List>
                        {item.child?.map((route, index) => (
                            route.sidebarProps ? (
                                <SidebarInsideItem item={route} key={index} />
                            ) : null
                        ))}
                    </List>
                </Collapse>
            </>
        ) : null
    )
}

export default SidebarItemCollapse