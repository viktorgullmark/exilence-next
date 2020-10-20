import { Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { appName, visitor } from '../..';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import SettingsTabs from '../../components/settings-tabs/SettingsTabs';
import { SettingStore } from '../../store/settingStore';

type SettingsProps = {
  settingStore?: SettingStore;
}

const Settings = (props: SettingsProps) => {
  useEffect(() => {
    visitor!.pageview('/settings', appName).send();
  });

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

export default inject('settingStore')(observer(Settings));
