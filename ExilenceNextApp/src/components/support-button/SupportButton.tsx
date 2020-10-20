import { ButtonBase } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStyles } from './SupportButton.styles';
import { openLink } from '../../utils/window.utils';
import clsx from 'clsx';

type SupportButtonProps = {
  noMargin?: boolean;
}

const SupportButton = ({ noMargin }: SupportButtonProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <div className={classes.root}>
      <ButtonBase
        className={clsx(classes.button, { [classes.noMargin]: noMargin })}
        href='https://discord.gg/yxuBrPY'
        onClick={(e) => openLink(e)}
      >
        {t('label.support')}
      </ButtonBase>
    </div>
  );
};

export default SupportButton;
