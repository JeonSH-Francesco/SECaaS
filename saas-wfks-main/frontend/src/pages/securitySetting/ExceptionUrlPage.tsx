import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Divider from '@mui/material-next/Divider';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress'; // 추


import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { getCookie } from '../../utils/cookie';
import { URLType } from '../../models/URLType';
import colorConfigs from '../../config/colorConfigs';
import ExcepUrlCreateModal from './component/ExcepUrlCreateModal';
import ExcepUrlUpdateModal from './component/ExcepUrlUpdateModal';
import ApplyUrlCreateModal from './component/ApplyUrlCreateModal';
import ApplyUrlUpdateModal from './component/ApplyUrlUpdateModal';
import { authHeaders } from '../../utils/headers';


type Props = {}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'url', headerName: '적용 URL', width: 350 },
  { field: 'desc', headerName: '적용 사유', width: 500 },
];



const ExceptionUrlPage = (props: Props) => {

  const [exceptionUrlList, setExceptionUrlList] = useState<URLType[]>([]);
  const [applyUrlList, setApplyUrlList] = useState<URLType[]>([]);
  const [loading, setLoading] = useState(false); // 추가

  const [selectedExpItem, setSelectedExpItem] = useState<URLType | undefined>();

  const [isExpCreateModalOpen, setIsExpCreateModalOpen] = useState(false);
  const openExpCreateModal = () => setIsExpCreateModalOpen(true);
  const closeExpCreateModal = () => setIsExpCreateModalOpen(false);

  const [isExpUpdateModalOpen, setIsExpUpdateModalOpen] = useState(false);
  const openExpUpdateModal = () => setIsExpUpdateModalOpen(true);
  const closeExpUpdateModal = () => setIsExpUpdateModalOpen(false);

  const [selectedApplyItem, setSelectedApplyItem] = useState<URLType | undefined>();

  const [isApplyCreateModalOpen, setIsApplyCreateModalOpen] = useState(false);
  const openApplyCreateModal = () => setIsApplyCreateModalOpen(true);
  const closeApplyCreateModal = () => setIsApplyCreateModalOpen(false);

  const [isApplyUpdateModalOpen, setIsApplyUpdateModalOpen] = useState(false);
  const openApplyUpdateModal = () => setIsApplyUpdateModalOpen(true);
  const closeApplyUpdateModal = () => setIsApplyUpdateModalOpen(false);
  

  const security_policy_id = getCookie("security_policy_id");
  const urlExcp = process.env.REACT_APP_DB_HOST+'/security_policy/' + security_policy_id + '/exception_url_list';
  const urlApply = process.env.REACT_APP_DB_HOST+'/security_policy/' + security_policy_id + '/apply_url_list';

  const handleSelectedExpChange = (selectionModel: number[]) => {
    const selectedId = selectionModel.length > 0 ? selectionModel[0] : null;
    const selectedRowData = selectedId
      ? exceptionUrlList.find((row) => row.id === selectedId) || null
      : undefined;
      selectedRowData && setSelectedExpItem(selectedRowData);
      openExpUpdateModal()
  };


  const handleSelectedApplyChange = (selectionModel: number[]) => {
    const selectedId = selectionModel.length > 0 ? selectionModel[0] : null;
    const selectedRowData = selectedId
      ? applyUrlList.find((row) => row.id === selectedId) || null
      : undefined;
      selectedRowData && setSelectedApplyItem(selectedRowData);
      openApplyUpdateModal()
  };

  
  useEffect(() => {
    setLoading(true); 

    fetch(urlApply, {
      headers: authHeaders
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false); 

        if (data['header']['isSuccessful'] === true) {
          setApplyUrlList(data['result'])
        }
      })
      .catch((error) => {
        setLoading(false); // 데이터 로딩 에러 시 종료
        console.error('요청 중 오류 발생:', error);
      });

    setTimeout(() => {}, 4000);

    fetch(urlExcp, {
      headers: authHeaders
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false); // 데이터 로딩 종료

        if (data['header']['isSuccessful'] === true) {
          setExceptionUrlList(data['result'])
        }
      })
      .catch((error) => {
        setLoading(false); // 데이터 로딩 에러 시 종료
        console.error('요청 중 오류 발생:', error);
      });
  }, [urlExcp, urlApply]);


  return (
    <Box paddingRight="50px" paddingLeft="10px" >
       <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
          <Typography fontSize="18px" fontWeight="bold">적용 URL 목록 </Typography>
          <Button sx={{
            color: colorConfigs.button.blue,
            backgroundColor: colorConfigs.button.white,
            border: 1,
            borderColor: colorConfigs.button.blue,
            borderRadius: "40px",
            paddingX: "32px",
            margin: "4px",
          }}
            onClick={openApplyCreateModal}>
            적용 URL 추가하기
          </Button>
        </Box>

        <Box style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={applyUrlList}
            columns={columns}
            pageSizeOptions={[5, 10]}
            onRowSelectionModelChange={(selectionModel) => handleSelectedApplyChange(selectionModel.map(Number))}
            />
        </Box>
      <ApplyUrlCreateModal isOpen={isApplyCreateModalOpen} closeModal={closeApplyCreateModal}></ApplyUrlCreateModal>
      <ApplyUrlUpdateModal isOpen={isApplyUpdateModalOpen} closeModal={closeApplyUpdateModal} excepUrl={selectedApplyItem}></ApplyUrlUpdateModal>

        <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
          <Typography fontSize="18px" fontWeight="bold">예외 URL 목록 </Typography>
          <Button sx={{
            color: colorConfigs.button.blue,
            backgroundColor: colorConfigs.button.white,
            border: 1,
            borderColor: colorConfigs.button.blue,
            borderRadius: "40px",
            paddingX: "32px",
            margin: "4px",
          }}
            onClick={openExpCreateModal}>
            {loading ? <CircularProgress size={20} color="inherit" /> : '예외 URL 추가하기'}
          </Button>
        </Box>

        <Box style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={exceptionUrlList}
            columns={columns}
            pageSizeOptions={[5, 10]}
            onRowSelectionModelChange={(selectionModel) => handleSelectedExpChange(selectionModel.map(Number))}
            />
        </Box>
      <ExcepUrlCreateModal isOpen={isExpCreateModalOpen} closeModal={closeExpCreateModal}></ExcepUrlCreateModal>
      <ExcepUrlUpdateModal isOpen={isExpUpdateModalOpen} closeModal={closeExpUpdateModal} excepUrl={selectedExpItem}></ExcepUrlUpdateModal>
    </Box>
    
  );
}





export default ExceptionUrlPage