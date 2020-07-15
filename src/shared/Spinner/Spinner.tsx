import { Box, CircularProgress } from '@material-ui/core';
import React from 'react';

const Spinner = () => (
  <Box position={'absolute'} display={'flex'} left={0} top={0} width={1} height={1} alignItems={'center'} justifyContent={'center'}>
    <CircularProgress />
  </Box>
);

export default Spinner;
