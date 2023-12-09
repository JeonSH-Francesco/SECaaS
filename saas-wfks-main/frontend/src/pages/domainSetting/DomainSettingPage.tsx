import { Box, Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import DomainItem from './DomainItem';
import DomainNoticeBox from './DomainNoticeBox';
import colorConfigs from '../../config/colorConfigs';
import DomainCreateModal from './DomainCreateModal';
import { getCookie } from '../../utils/cookie';
import { authHeaders } from '../../utils/headers';
import { AppType } from '../../models/DomainType';

const DomainSettingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [appList, setAppList] = useState<AppType[]>([]);
  const [loading, setLoading] = useState(true);

  const app_id = getCookie('wf_app_id');
  const token = localStorage.getItem('token');
  const user_id = getCookie('user_id');
  const url = process.env.REACT_APP_DB_HOST+'/app/' + app_id + '/domain-list?user_id=' + user_id;

  useEffect(() => {
    setLoading(true);
    fetch(url, {
      headers: authHeaders,
    })
      .then((response) => response.json())
      .then((data) => {
        setAppList(data);
      })
      .catch((error) => {
        console.error('요청 중 오류 발생:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url, token]);

  return (
    <Box>
      <Box
        sx={{
          textAlign: 'right',
          marginBottom: '8px',
        }}
      >
        <Button
          sx={{
            color: colorConfigs.button.blue,
            backgroundColor: colorConfigs.button.white,
            border: 1,
            borderColor: colorConfigs.button.blue,
            borderRadius: '40px',
            paddingX: '32px',
            margin: '4px',
          }}
          onClick={openModal}
        >
          도메인 추가하기
        </Button>
        <DomainCreateModal isOpen={isModalOpen} closeModal={closeModal} />
      </Box>
      <DomainNoticeBox></DomainNoticeBox>
      {loading ? (
      <CircularProgress sx={{ margin: '20px' }} />
    ) : (
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {appList && appList.map((app) => (
          <DomainItem  app={app} />
        ))}
      </Box>
    )}
    </Box>
  );
};

export default DomainSettingPage;
