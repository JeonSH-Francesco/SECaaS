import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import { getCookie } from '../../utils/cookie';
import { ExceptionIpType } from '../../models/ExceptionIpType';
import colorConfigs from '../../config/colorConfigs';
import ApplyIpCreateModal from './component/ApplyIpCreateModal';
import ApplyIpUpdateModal from './component/ApplyIpUpdateModal';
import ExcepIpCreateModal from './component/ExcepIpCreateModal';
import ExcepIpUpdateModal from './component/ExcepIpUpdateModal';
import { authHeaders } from '../../utils/headers';


type Props = {}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'client_ip', headerName: '적용 네트워크 IP', width: 350 },
  { field: 'client_mask', headerName: '서브넷 마스크', width: 350 },
  { field: 'desc', headerName: '적용사유', width: 500 },
];



const ExceptionIpPage = (props: Props) => {
    
  const [exceptionIpList, setExceptionIpList] = useState<ExceptionIpType[]>([]);
  const [applyIpList, setApplyIpList] = useState<ExceptionIpType[]>([]);

  const [selectedExpItem, setSelectedExpItem] = useState<ExceptionIpType | undefined>();

  const [isExpCreateModalOpen, setIsExpCreateModalOpen] = useState(false);
  const openExpCreateModal = () => setIsExpCreateModalOpen(true);
  const closeExpCreateModal = () => setIsExpCreateModalOpen(false);

  const [isExpUpdateModalOpen, setIsExpUpdateModalOpen] = useState(false);
  const openExpUpdateModal = () => setIsExpUpdateModalOpen(true);
  const closeExpUpdateModal = () => setIsExpUpdateModalOpen(false);

  const [selectedApplyItem, setSelectedApplyItem] = useState<ExceptionIpType | undefined>();

  const [isApplyCreateModalOpen, setIsApplyCreateModalOpen] = useState(false);
  const openApplyCreateModal = () => setIsApplyCreateModalOpen(true);
  const closeApplyCreateModal = () => setIsApplyCreateModalOpen(false);

  const [isApplyUpdateModalOpen, setIsApplyUpdateModalOpen] = useState(false);
  const openApplyUpdateModal = () => setIsApplyUpdateModalOpen(true);
  const closeApplyUpdateModal = () => setIsApplyUpdateModalOpen(false);
  

  const security_policy_id = getCookie("security_policy_id");
  const urlExcp = process.env.REACT_APP_DB_HOST+'/security_policy/' + security_policy_id + '/exception_ip_list';
  const urlApply = process.env.REACT_APP_DB_HOST+'/security_policy/' + security_policy_id + '/apply_ip_list';

  const handleSelectedExpChange = (selectionModel: number[]) => {
    const selectedId = selectionModel.length > 0 ? selectionModel[0] : null;
    const selectedRowData = selectedId
      ? exceptionIpList.find((row) => row.id === selectedId) || null
      : undefined;
      selectedRowData && setSelectedExpItem(selectedRowData);
      openExpUpdateModal()
  };


  const handleSelectedApplyChange = (selectionModel: number[]) => {
    const selectedId = selectionModel.length > 0 ? selectionModel[0] : null;
    const selectedRowData = selectedId
      ? applyIpList.find((row) => row.id === selectedId) || null
      : undefined;
      selectedRowData && setSelectedApplyItem(selectedRowData);
      openApplyUpdateModal()
  };

  useEffect(() => {

    fetch(urlApply, {
      headers: authHeaders
    })
      .then((response) => response.json())
      .then((data) => {
        if (data['header']['isSuccessful'] === true) {
          setApplyIpList(data['result'])
        }
      })
      .catch((error) => {
        console.error('요청 중 오류 발생:', error);
      });
    setTimeout(() => {}, 4000);
  
    fetch(urlExcp, {
      headers: authHeaders
    })
      .then((response) => response.json())
      .then((data) => {
        if (data['header']['isSuccessful'] === true) {
          setExceptionIpList(data['result'])
        }
      })
      .catch((error) => {
        console.error('요청 중 오류 발생:', error);
      });
  }, [urlExcp, urlApply]);

    

  return (
    <Box paddingRight="50px" paddingLeft="10px" >
       <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
          <Typography fontSize="18px" fontWeight="bold">적용 IP 목록 </Typography>
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
            적용 IP 추가하기
          </Button>
        </Box>

        <Box style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={applyIpList}
            columns={columns}
            pageSizeOptions={[5, 10]}
            onRowSelectionModelChange={(selectionModel) => handleSelectedApplyChange(selectionModel.map(Number))}
            />
        </Box>
      <ApplyIpCreateModal isOpen={isApplyCreateModalOpen} closeModal={closeApplyCreateModal}></ApplyIpCreateModal>
      <ApplyIpUpdateModal isOpen={isApplyUpdateModalOpen} closeModal={closeApplyUpdateModal} excepIp={selectedApplyItem}></ApplyIpUpdateModal>

        <Box sx={{ display: 'flex', justifyContent: "space-between" }}>
          <Typography fontSize="18px" fontWeight="bold">예외 IP 목록 </Typography>
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
            예외 IP 추가하기
          </Button>
        </Box>

        <Box style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={exceptionIpList}
            columns={columns}
            pageSizeOptions={[5, 10]}
            autoPageSize
            onRowSelectionModelChange={(selectionModel) => handleSelectedExpChange(selectionModel.map(Number))}
            />
        </Box>
      <ExcepIpCreateModal isOpen={isExpCreateModalOpen} closeModal={closeExpCreateModal}></ExcepIpCreateModal>
      <ExcepIpUpdateModal isOpen={isExpUpdateModalOpen} closeModal={closeExpUpdateModal} excepIp={selectedExpItem}></ExcepIpUpdateModal>
    </Box>
    
  );
}





export default ExceptionIpPage