import React from 'react';
import { Typography, Box } from '@material-ui/core';
import { observer } from 'mobx-react';

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
      style={{ width: '100%' }}
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <Box p={2}>{children}</Box>
    </Typography>
  );
}

export default observer(SettingsTab);