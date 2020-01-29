import React from 'react';
import { Box, Typography } from '@material-ui/core';

interface Props {
  title: string;
  body: string;
}

const StepContent: React.FC<Props> = ({ title, body }: Props) => {
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
