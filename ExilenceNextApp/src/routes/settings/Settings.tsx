import React from 'react';
import { observer } from 'mobx-react';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import SettingsSection from '../../components/settings-section/SettingsSection';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';

const Settings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <FeatureWrapper>
      <SettingsSection title={t('title.net_worth_settings')}></SettingsSection>
    </FeatureWrapper>
  );
};

export default observer(Settings);
