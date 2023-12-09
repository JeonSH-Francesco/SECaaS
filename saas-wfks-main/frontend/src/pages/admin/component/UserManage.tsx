// UserManage.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';

interface User {
  id: number;
  companyName: string;
  userAppsCount: number;
}

interface UserManageProps {
  users: User[];
  loading: boolean;
  fetchUserApps: (userId: number) => void;
  selectedUserId: number | null;
  setSelectedAppId: React.Dispatch<React.SetStateAction<number | null>>;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'companyName', headerName: 'Company Name', width: 200 },
  { field: 'userAppsCount', headerName: 'User Apps Count', width: 150 },
];

const UserManage: React.FC<UserManageProps> = ({ users, loading, fetchUserApps, selectedUserId, setSelectedAppId }) => {
  const rows = users.map((user) => ({
    id: user.id, // Add a unique identifier for each row
    companyName: user.companyName,
    userAppsCount: user.userAppsCount,
  }));

  return (
    <Box>
      <Typography variant="h5">User Management</Typography>
      {loading ? (
        <CircularProgress style={{ margin: '20px' }} />
      ) : (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            onRowClick={(params: GridRowParams) => {
              if (params.id != null) {
                fetchUserApps(Number(params.id));
                setSelectedAppId(null); // Reset selected app when a new user is selected
              }
            }}
          />
        </div>
      )}
    </Box>
  );
};

export default UserManage;
