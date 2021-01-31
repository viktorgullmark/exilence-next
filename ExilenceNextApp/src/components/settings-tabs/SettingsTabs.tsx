import { Box, Typography } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UiStateStore } from '../../store/uiStateStore';
import CustomPricesSettingsContainer from './custom-prices-settings/CustomPricesSettingsContainer';
import LogSettingsContainer from './log-settings/LogSettingsContainer';
import NetWorthSettingsContainer from './net-worth-settings/NetWorthSettingsContainer';
import SettingsTab from './settings-tab/SettingsTab';
import useStyles from './SettingsTabs.styles';
import SnapshotSettingsContainer from './snapshot-settings/SnapshotSettingsContainer';
import UiSettingsContainer from './ui-settings/UiSettingsContainer';

function a11yProps(index: any) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

type SettingsTabsProps = {
  uiStateStore?: UiStateStore;
};

const SettingsTabs = ({ uiStateStore }: SettingsTabsProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { settingsTabIndex, setSettingsTabIndex } = uiStateStore!;

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setSettingsTabIndex(newValue);
  };

  return (
    <div className={classes.root}>
      {settingsTabIndex !== undefined && (
        <>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={settingsTabIndex}
            onChange={handleChange}
            aria-label="settings tabs"
            className={classes.tabs}
            classes={{
              indicator: classes.indicator,
            }}
          >
            <Tab label={t('title.net_worth_settings')} className={classes.tab} {...a11yProps(0)} />
            <Tab label={t('title.ui_settings')} className={classes.tab} {...a11yProps(1)} />
            <Tab
              label={t('title.custom_prices_settings')}
              className={classes.tab}
              {...a11yProps(2)}
            />
            
            <Tab label={t('title.area_settings')} className={classes.tab} {...a11yProps(3)} />
          </Tabs>
          <SettingsTab value={settingsTabIndex} index={0}>
            <Box className={classes.subSection}>
              <Typography variant="overline">{t('title.snapshot_settings')}</Typography>
              <Box my={2}>
                <SnapshotSettingsContainer />
              </Box>
            </Box>
            <Box className={classes.subSection}>
              <Typography variant="overline">{t('title.pricing_settings')}</Typography>
              <Box my={2}>
                <NetWorthSettingsContainer />
              </Box>
            </Box>
          </SettingsTab>
          <SettingsTab value={settingsTabIndex} index={1}>
            <Box className={classes.subSection}>
              <Typography variant="overline">{t('title.general')}</Typography>
              <Box my={2}>
                <UiSettingsContainer />
              </Box>
            </Box>
          </SettingsTab>
          <SettingsTab value={settingsTabIndex} index={2}>
            <Box className={classes.subSection}>
              <Typography variant="overline">{t('title.custom_prices_settings')}</Typography>
              <Box my={2}>
                <CustomPricesSettingsContainer />
              </Box>
            </Box>
          </SettingsTab>
          <SettingsTab value={settingsTabIndex} index={3}>
            <Box className={classes.subSection}>
              <Typography variant="overline">{t('title.log_settings')}</Typography>
              <Box my={2}>
                <LogSettingsContainer />
              </Box>
            </Box>
          </SettingsTab>
        </>
      )}
    </div>
  );
};

export default inject('uiStateStore')(observer(SettingsTabs));
