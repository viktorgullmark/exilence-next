import React from 'react';
import { observer } from 'mobx-react';
import { Typography, Grid } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import SettingsSection from '../../components/settings-section/SettingsSection';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';

const Settings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FeatureWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SettingsSection
            title={t('title.net_worth_settings')}
          ></SettingsSection>
        </Grid>
        <Grid item xs={12}>
          <SettingsSection title={t('title.window_settings')}></SettingsSection>
        </Grid>
      </Grid>
    </FeatureWrapper>
  );
};

export default observer(Settings);
