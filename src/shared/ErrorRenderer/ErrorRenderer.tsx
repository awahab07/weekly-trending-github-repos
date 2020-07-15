import { useTheme } from '@material-ui/core';
import React from 'react';
import BoxTypography from '../BoxComponents/BoxTypography';

const ErrorRenderer = ({ message }: { message: string }) => {
  const theme = useTheme();

  return (
    <BoxTypography
      my={2}
      p={2}
      bgcolor={theme.palette.error.contrastText}
      color={theme.palette.error.main}
    >
      {message}
    </BoxTypography>
  );
};

export default ErrorRenderer;
