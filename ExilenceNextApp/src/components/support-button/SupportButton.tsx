import { ButtonBase } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStyles } from './SupportButton.styles';
import { openLink } from '../../utils/window.utils';

const SupportButton: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <ButtonBase
        className={classes.button}
        href="https://discord.gg/yxuBrPY"
        onClick={e => openLink(e)}
      >
        {t('label.support')}
      </ButtonBase>
    </div>
  );
};

export default SupportButton;
