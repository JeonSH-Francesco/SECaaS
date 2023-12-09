import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Divider from '@mui/material-next/Divider';
import TextField from '@mui/material/TextField';


import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { DataGrid, GridColDef, GridRowParams, GridRowId } from '@mui/x-data-grid';


const send_box = () => {
    return (
       <div></div>
    );
}