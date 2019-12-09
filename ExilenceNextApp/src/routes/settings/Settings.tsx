import React from 'react';
import { observer } from 'mobx-react';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="h1">{t('title.settings')}</Typography>
    </>
  );
};

export default observer(Settings);
