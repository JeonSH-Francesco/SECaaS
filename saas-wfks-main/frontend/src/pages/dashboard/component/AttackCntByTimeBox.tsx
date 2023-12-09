import { Box, Typography } from '@mui/material'
import React from 'react'
import styleConfigs from '../../../config/styleConfigs'
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { AttackType } from '../../../models/AttackType'

type Props = {
  data : AttackType[]
}

const AttackCntByTimeBox = (props: Props) => {
  return (
    <Box sx={{
      flex: "1",
      borderRadius: "20px",
      padding: "20px",
      margin: "20px",
      boxShadow: styleConfigs.boxShadow
  }}>
      <Typography sx={{ fontWeight: "700" }}>탐지된 공격</Typography>
      <BarChart
      width={500}
      height={300}
      data={props.data}
      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="interval"  tick={false} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  </Box>
  )
}

export default AttackCntByTimeBox