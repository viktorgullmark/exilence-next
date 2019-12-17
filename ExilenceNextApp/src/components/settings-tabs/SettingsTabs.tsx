import { Box, Grid, Typography } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { gridSpacing } from '../../assets/themes/exilence-theme';
import { resizeHandleContainerHeight, toolbarHeight } from '../header/Header';
import { innerToolbarHeight } from '../toolbar/Toolbar';
import NetWorthSettingsContainer from './net-worth-settings/NetWorthSettingsContainer';
import SettingsTab from './settings-tab/SettingsTab';

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: `calc(100vh - ${toolbarHeight}px - ${resizeHandleContainerHeight}px - ${innerToolbarHeight}px - ${theme.spacing(
      gridSpacing * 2
    )}px)`
  },
  tabs: {
    minWidth: 160,
    borderRight: `1px solid ${theme.palette.divider}`
  },
  tab: {
    minWidth: 'auto'
  },
  indicator: {
    backgroundColor: theme.palette.primary.light
  },
  subSection: {}
}));

const SettingsTabs: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="settings tabs"
        className={classes.tabs}
        classes={{
          indicator: classes.indicator
        }}
      >
        <Tab label={t('title.net_worth_settings')} className={classes.tab} {...a11yProps(0)} />
      </Tabs>
      <SettingsTab value={value} index={0}>
        <Box className={classes.subSection}>
          <Typography variant="overline">
            {t('title.pricing_settings')}
          </Typography>
          <Box my={2}>
            <NetWorthSettingsContainer />
          </Box>
        </Box>
      </SettingsTab>
    </div>
  );
};

export default observer(SettingsTabs);
