import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loading() {
  return (
    <Box sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        'z-index': 2,
        opacity: 0.8,
        backgroundColor: 'gray'
     }}>
      <CircularProgress />
    </Box>
  );
}