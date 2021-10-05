import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

import useStyles from './TabPanel.styles';

type TabPanelProps = {
  children?: ReactNode;
  index: any;
  value: any;
};

export const tabPanelSpacing = 2;

const TabPanel = ({ children, index, value }: TabPanelProps) => {
  const classes = useStyles();
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      <Box p={tabPanelSpacing} className={classes.root}>
        {children}
      </Box>
    </Typography>
  );
};

export default TabPanel;
