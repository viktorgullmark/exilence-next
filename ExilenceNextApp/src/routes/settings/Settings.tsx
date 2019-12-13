import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { visitor, appName } from '../..';

const Settings: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    visitor!.pageview('/settings', appName).send();
  })

  return (
    <>
      <Typography variant="h1">{t('title.settings')}</Typography>
    </>
  );
};

export default observer(Settings);
