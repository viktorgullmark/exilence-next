import React from 'react';
import { Box, Typography } from '@mui/material';

type StepContentProps = {
  title: string;
  body: string;
};

const StepContent = ({ title, body }: StepContentProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {body}
      </Typography>
    </Box>
  );
};

export default StepContent;
