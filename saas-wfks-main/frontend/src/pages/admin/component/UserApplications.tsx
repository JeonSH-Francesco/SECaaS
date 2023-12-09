// UserApplications.tsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';

interface UserApplication {
  table_id: number;
  user_application_id: number;
  domain: string;
  desc: string;
}

interface UserApplicationsProps {
  userApps: UserApplication[];
  loading: boolean;
  selectedUserId: number;
  setSelectedAppId: React.Dispatch<React.SetStateAction<number | null>>;
  fetchUserAppLogs: (userAppId: number) => Promise<void>;
}

const columns: GridColDef[] = [
  { field: 'table_id', headerName: 'Table ID', width: 120 },
  { field: 'domain', headerName: 'Domain', width: 200 },
  { field: 'desc', headerName: 'Description', width: 200 },
];

const UserApplications: React.FC<UserApplicationsProps> = ({
  userApps,
  loading,
  selectedUserId,
  setSelectedAppId,
  fetchUserAppLogs,
}) => {
  const handleRowClick = async (params: GridRowParams) => {
    if (params.id != null) {
      const clickedDomain = userApps.find(app => app.table_id === parseInt(params.id as string, 10));
      if (clickedDomain) {
        setSelectedAppId(clickedDomain.user_application_id);
        await fetchUserAppLogs(clickedDomain.user_application_id); // Await the fetch
      }
    }
  };

  return (
    <Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Typography variant="h6">User Applications for User ID: {selectedUserId}</Typography>
          <DataGrid
            rows={userApps.map((app) => ({ ...app, id: app.table_id.toString() }))}
            columns={columns}
            checkboxSelection
            onRowClick={handleRowClick}
          />
        </Box>
      )}
    </Box>
  );
};

export default UserApplications;