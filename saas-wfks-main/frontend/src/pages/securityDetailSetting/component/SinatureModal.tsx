import React from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { SignatureType } from '../../../models/SignatureType';
import ModalWrapper from '../../../components/layout/ModalWrapper';
import colorConfigs from '../../../config/colorConfigs';

type Props = {
    isOpen: boolean,
    closeModal: any,
    sig: SignatureType
}

const SignatureModal = (props: Props) => {

    function warningToStr(warning: Number) {
        switch (warning) {
            case 1: return "낮음";
            case 2: return "보통";
            case 3: return "높음";
        }
    }

    function warningToColor(warning: Number) {
        switch (warning) {
            case 1: return colorConfigs.warning.low;
            case 2: return colorConfigs.warning.medium;
            case 3: return colorConfigs.warning.high;
        }
    }


    return (
        <ModalWrapper isOpen={props.isOpen} closeModal={props.closeModal}>
            <Box sx={{ padding: "20px", borderRadius: "24px" }}>
                <Typography variant='h6'>상세보기</Typography>
                <Divider sx={{
                    marginTop: "8px",
                    marginBottom: "16px",
                    borderWidth: "1px",
                    color: colorConfigs.noticeBoxBg
                }} />

                <Box display="flex" padding="4px">
                    <Typography width="20%">위험도</Typography>
                    <Box width="80%" >
                        <Typography sx={{
                            color: warningToColor(Number(props.sig.warning)),
                            fontWeight: "bold"
                        }}>{warningToStr(Number(props.sig.warning))}</Typography>
                        
                    </Box>
                </Box>

                <Box display="flex" padding="4px">
                    <Typography width="20%">공격 예제</Typography>
                    <Box width="80%" >
                        <Typography>{props.sig.poc_examples}</Typography>
                    </Box>
                </Box>

                <Box display="flex" padding="4px">
                    <Typography width="20%">설명</Typography>
                    <Box width="80%" >
                        <Typography>{props.sig.ko_desc}</Typography>
                    </Box>
                </Box>

                <Box display="flex" padding="4px">
                    <Typography width="20%">영향</Typography>
                    <Box width="80%" >
                        <Typography>{props.sig.impact}</Typography>
                    </Box>
                </Box>
            </Box>
        </ModalWrapper>
    );
};

export default SignatureModal;
