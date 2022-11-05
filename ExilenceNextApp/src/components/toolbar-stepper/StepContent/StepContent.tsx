import React from 'react';
import { Box, Typography } from '@mui/material';

type StepContentProps = {
  title: string;
  body: string | React.ReactElement;
  body2?: string;
};

const StepContent = ({ title, body, body2 }: StepContentProps) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography style={{ whiteSpace: 'pre-line' }} variant="body2" gutterBottom>
        {body}
      </Typography>
      {body2 && (
        <Typography variant="body2" gutterBottom>
          {body2}
        </Typography>
      )}
    </Box>
  );
};

export default StepContent;
