import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';

import { appName, visitor } from '../..';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import SettingsTabs from '../../components/settings-tabs/SettingsTabs';
import { UiStateStore } from '../../store/uiStateStore';
import { AccountStore } from '../../store/accountStore';

type SettingsProps = {
  uiStateStore: UiStateStore;
  accountStore: AccountStore;
};

const Settings = ({ uiStateStore, accountStore }: SettingsProps) => {
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

export default inject('uiStateStore', 'accountStore')(observer(Settings));
