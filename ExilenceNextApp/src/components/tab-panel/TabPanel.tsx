import React from 'react';
import { Typography, Box, makeStyles, Theme } from '@material-ui/core';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export const tabPanelSpacing = 2;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.default
  }
}));

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  index,
  value
}: TabPanelProps) => {
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
