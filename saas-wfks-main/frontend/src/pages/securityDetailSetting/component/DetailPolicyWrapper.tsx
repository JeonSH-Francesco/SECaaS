import React, { ReactNode, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { RootState } from '../../../utils/store';
import { setAppState } from '../../../utils/features/appSateSlice';
import appRoutes from '../../../routes/appRoutes';
import colorConfigs from '../../../config/colorConfigs';

type Props = {
  state?: string,
  children: ReactNode
};

const DetailPolicyWrapper = (props: Props) => {
  const { appState } = useSelector((state: RootState) => state.appState);
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.state) {
      dispatch(setAppState(props.state));
    }
  }, [dispatch, props]);

  return (
    <Box>
      <Box display="flex" flexWrap="wrap" >
        {
          appRoutes.appPolicyDetailRoutes.map((route, index) => (
            route.path && <Button
              component={Link}
              to={route.path}
              sx={{
                backgroundColor: appState === route.state ? colorConfigs.button.pioBg : colorConfigs.button.white,
                borderColor: colorConfigs.button.pioBg,
                border: "solid",
                borderRadius: "24px",
                minWidth: "180px",
                paddingX: "16px",
                paddingY: "5px",
                margin: "4px",
              }}
            >
              {route.sidebarProps?.displayText}
            </Button>
          ))
        }

      </Box>
      <Box sx={{
        paddingY : "20px",
        paddingX : "10px"
      }}>
        {props.children}
      </Box>
    </Box>
  )
}

export default DetailPolicyWrapper

