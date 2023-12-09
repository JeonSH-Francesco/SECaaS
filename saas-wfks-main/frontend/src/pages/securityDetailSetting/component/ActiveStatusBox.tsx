import React from 'react'
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material'
import { securityStatus } from '../../../enums/StatusEnum';
import colorConfigs from '../../../config/colorConfigs';

type Props = {
    name : string,
    status : string,
    onValueChange: (value: string) => void;
}

const ActiveStatusBox = (props: Props) => {
    
    function handleRadioChange(newValue : string) {
        props.onValueChange(newValue);
        };

    return (
        <Box sx={{
            backgroundColor: colorConfigs.noticeBoxBg,
            height: "100px",
            borderRadius: "24px"
        }}>
            <Box display="flex" sx={{
                justifyContent: "space-between",
                height: "100%",
                alignItems: "center",
                paddingX: "24px"
            }}>
                <Typography sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    {props.name} 보안 활성화
                </Typography>

                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        value={props.status}
                        onChange={(e => handleRadioChange(e.target.value.toString()))}>
                        <Box display="flex">
                            <Box sx={{
                                padding: "18px"
                            }}>
                                <Typography>예외</Typography>
                                <FormControlLabel value={securityStatus.excpetion.toString()} control={<Radio />} label={undefined} />
                            </Box>
                            <Box sx={{
                                padding: "18px"
                            }}>
                                <Typography>탐지</Typography>
                                <FormControlLabel value={securityStatus.detect.toString()} control={<Radio />} label={undefined} />
                            </Box>
                            <Box sx={{
                                padding: "18px"
                            }}>
                                <Typography>차단</Typography>
                                <FormControlLabel value={securityStatus.block.toString()} control={<Radio />} label={undefined} />
                            </Box>
                        </Box>
                    </RadioGroup>
                </FormControl>
            </Box>
        </Box>
    )
}

export default ActiveStatusBox