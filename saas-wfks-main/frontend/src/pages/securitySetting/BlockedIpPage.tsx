import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { getCookie } from '../../utils/cookie';
import colorConfigs from '../../config/colorConfigs';
import BlockIpCreateModal from './component/BlockIpCreateModal';
import { BlockIpType } from '../../models/BlockIpType';
import BlockIpUpdateModal from './component/BlockIpUpdateModal';
import { authHeaders } from '../../utils/headers';


type Props = {}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'ip', headerName: '차단 네트워크 IP', width: 350 },
  { field: 'subnetmask', headerName: '서브넷 마스크', width: 350 },
  { field: 'desc', headerName: '차단 사유', width: 500 },
];

const BlockedIpPage = (props: Props) => {

  const [blockIpList, setBlockIpList] = useState<BlockIpType[]>([]);
  const [selectedItem, setSelectedItem] = useState<BlockIpType | undefined>();

  const security_policy_id = getCookie("security_policy_id");
  const url = process.env.REACT_APP_DB_HOST+'/security_policy/' + security_policy_id + '/block_ip_filter/ip_list';
  
  useEffect(() => {
    fetch(url, {
      headers: authHeaders
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data['header']['isSuccessful'] === true) {
          setBlockIpList(data['result']);
        }
      })
      .catch((error) => {
        console.error('요청 중 오류 발생:', error);
      });
  }, [url]); 


  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const openUpdateModal = () => setIsUpdateModalOpen(true);
  const closeUpdateModal = () => setIsUpdateModalOpen(false);

  const handleSelectionModelChange = (selectionModel: number[]) => {
    const selectedId = selectionModel.length > 0 ? selectionModel[0] : null;
    const selectedRowData = selectedId
      ? blockIpList.find((row) => row.id === selectedId) || null
      : undefined;
      selectedRowData && setSelectedItem(selectedRowData);
      openUpdateModal()
  };

  return (
    <Box paddingRight="50px" paddingLeft="10px" >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography fontSize="18px" fontWeight="bold">차단 IP 목록 </Typography>
        <Button sx={{
          color: colorConfigs.button.blue,
        backgroundColor: colorConfigs.button.white,
          border: 1,
          borderColor: colorConfigs.button.blue,
          borderRadius: "40px",
          paddingX: "32px",
          margin: "4px",
        }}
          onClick={openCreateModal}>
          차단IP 추가하기
        </Button>
      </Box>
      
      <br></br>
      <Box style={{ height: "400", width: "100%" }}>
        <DataGrid
          rows={blockIpList}
          columns={columns}
          pageSizeOptions={[5, 10]}
          onRowSelectionModelChange={(selectionModel) => handleSelectionModelChange(selectionModel.map(Number))}
        />
      </Box>

      <br></br>
      <BlockIpCreateModal isOpen={isCreateModalOpen} closeModal={closeCreateModal}></BlockIpCreateModal>
      <BlockIpUpdateModal isOpen={isUpdateModalOpen} closeModal={closeUpdateModal} blockIp={selectedItem}></BlockIpUpdateModal>
    </Box>
  );
}


export default BlockedIpPage