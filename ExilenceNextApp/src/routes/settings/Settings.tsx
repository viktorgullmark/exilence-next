import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { appName, visitor } from '../..';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import SettingsTabs from '../../components/settings-tabs/SettingsTabs';

const Settings: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    visitor!.pageview('/settings', appName).send();
  });

  return (
    <FeatureWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SettingsTabs />
        </Grid>
      </Grid>
    </FeatureWrapper>
  );
};

export default observer(Settings);
