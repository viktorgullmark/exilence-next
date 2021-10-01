import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { appName, useStores, visitor } from '../..';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import SettingsTabs from '../../components/settings-tabs/SettingsTabs';

const Settings = () => {
  const { uiStateStore, accountStore } = useStores();
  useEffect(() => {
    if (!uiStateStore!.validated && !uiStateStore!.initiated && !uiStateStore!.isValidating) {
      accountStore!.validateSession('/settings');
    }
    visitor!.pageview('/settings', appName).send();
  }, []);

  return (
    <FeatureWrapper>
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ paddingBottom: 0 }}>
          <SettingsTabs />
        </Grid>
      </Grid>
    </FeatureWrapper>
  );
};

export default observer(Settings);
