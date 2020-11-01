import { Box, Typography } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UiStateStore } from '../../store/uiStateStore';
import SettingsTab from './components/settings-tab/SettingsTab';
import useStyles from './SettingsTabs.styles';
import SnapshotSettings from './general/snapshot-settings/SnapshotSettings';
import NetWorthSettings from './general/net-worth-settings/NetWorthSettings';
import CustomPricesSettings from './prices/custom-prices-settings/CustomPricesSettings';
import UiSettings from './interface/ui-settings/UiSettings';
import HardwareAccelerationSettings from './advanced/hardware-acceleration-settings/HardwareAccelerationSettings';
import ResetIndexedDbSettings from './advanced/reset-indexeddb-settings/ResetIndexedDbSettings';

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
            <Tab label={t('title.advanced_settings')} className={classes.tab} {...a11yProps(3)} />
          </Tabs>
          <SettingsTab value={settingsTabIndex} index={0}>
            <Box className={classes.subSection}>
              <Typography variant="overline">{t('title.snapshot_settings')}</Typography>
              <Box my={2}>
                <SnapshotSettings />
              </Box>
            </Box>
            <Box className={classes.subSection}>
              <Typography variant="overline">{t('title.pricing_settings')}</Typography>
              <Box my={2}>
                <NetWorthSettings />
              </Box>
            </Box>
          </SettingsTab>
          <SettingsTab value={settingsTabIndex} index={1}>
            <Box className={classes.subSection}>
              <Typography variant="overline">{t('title.general')}</Typography>
              <Box my={2}>
                <UiSettings />
              </Box>
            </Box>
          </SettingsTab>
          <SettingsTab value={settingsTabIndex} index={2}>
            <Box className={classes.subSection}>
              <Typography variant="overline">{t('title.custom_prices_settings')}</Typography>
              <Box my={2}>
                <CustomPricesSettings />
              </Box>
            </Box>
          </SettingsTab>
          <SettingsTab value={settingsTabIndex} index={3}>
            <Box className={classes.subSection}>
              <Typography variant="overline">{t('title.hardware_acceleration')}</Typography>
              <Box my={2}>
                <HardwareAccelerationSettings />
              </Box>
            </Box>
            <Box className={classes.subSection}>
              <Typography variant="overline">{t('title.reset_indexeddb')}</Typography>
              <Box my={2}>
                <ResetIndexedDbSettings />
              </Box>
            </Box>
          </SettingsTab>
        </>
      )}
    </div>
  );
};

export default inject('uiStateStore')(observer(SettingsTabs));
