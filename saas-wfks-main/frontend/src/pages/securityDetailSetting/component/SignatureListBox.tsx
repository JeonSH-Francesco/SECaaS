import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React, { useState } from 'react'
import { SignatureType } from '../../../models/SignatureType'
import colorConfigs from '../../../config/colorConfigs'
import SignatureModal from './SinatureModal'

type Props = {
    sigList: SignatureType[]
}

interface Column {
    label: "위험도" | "내용";
    minWidth?: number;
}

const columns: readonly Column[] = [
    { label: "위험도", minWidth: 80 },
    { label: "내용", minWidth: 160 },
]

const SignatureListBox = (props: Props) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [selectSigItem, setSelectSigItem ] = useState<SignatureType>();

    function warningToColor(warning : Number) {
        switch(warning) {
            case 1 : return colorConfigs.warning.low;
            case 2 : return colorConfigs.warning.medium;
            case 3 : return colorConfigs.warning.high;
        }
    }

    function warningToStr(warning : Number) {
        switch(warning) {
            case 1 : return "낮음";
            case 2 : return "보통";
            case 3 : return "높음";
        }
    }

    function handleRowClick(e: any, sig: SignatureType) {
        if (sig !== null && sig !== undefined) {
            setSelectSigItem(sig)
            openModal();
        }

    }

    return (
        <Paper sx={{ width: "100%", overflow: "hidden", marginTop: "20px", }}>
            <TableContainer sx={{ maxHeight: "440px", }}>
                <Table stickyHeader arial-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {
                                columns.map((column) => (
                                    <TableCell key={column.label} align='center' sx={{
                                      minWidth: column.minWidth
                                    }}>
                                      {column.label}
                                    </TableCell>
                                  ))
                            }
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {props.sigList.map((row) => (
                            <TableRow hover key={row.id.toString()} onClick={(e) => handleRowClick(e, row)}>
                                <TableCell align="center" sx={{
                                    color: warningToColor(Number(row.warning)),
                                    fontWeight: "bold"
                                }}>{warningToStr(Number(row.warning))}</TableCell>
                                <TableCell sx={{ paddingX: "60px", fontSize: "16px", fontWeight: "bold" }} align="left">{row.ko_desc}</TableCell>
                                
                            </TableRow>
                        ))}
                    </TableBody>
                    
                </Table>
            </TableContainer>
            {selectSigItem ? <SignatureModal isOpen={isModalOpen} closeModal={closeModal} sig={selectSigItem} /> : undefined}
            
        </Paper>

    )
}

export default SignatureListBox