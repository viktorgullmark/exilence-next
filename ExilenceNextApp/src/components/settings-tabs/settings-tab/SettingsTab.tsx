import React from 'react';
import { Typography, Box } from '@material-ui/core';

interface Props {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function SettingsTab(props: Props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <Box p={2}>{children}</Box>
    </Typography>
  );
}

export default SettingsTab;