import { inject, observer } from 'mobx-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { NotificationStore } from '../../store/notificationStore';
import { UiStateStore } from './../../store/uiStateStore';
import { makeStyles, Theme } from '@material-ui/core';
import { statusColors } from '../../assets/themes/exilence-theme';

interface NotifierProps {
  uiStateStore?: UiStateStore;
  notificationStore?: NotificationStore;
}

const useStyles = makeStyles((theme: Theme) => ({
  error: {
    background: statusColors.error
  },
  warning: {
    background: statusColors.warning
  },
  info: {
    background: statusColors.info
  },
  success: {
    background: statusColors.success
  },
  default: {
    background: theme.palette.background.default
  }
}));

const Notifier: React.FC<NotifierProps> = ({
  notificationStore
}: NotifierProps) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const storeDisplayed = (uuid: string) => {
    notificationStore!.addDisplayed(uuid);
  };

  const alerts = notificationStore!.alertNotifications;

  useMemo(() => {
    alerts.forEach(n => {
      if (notificationStore!.displayed.find(d => d === n.uuid) !== undefined)
        return;
      toast(
        t(n.title, n.translateParam ? { param: n.translateParam } : undefined),
        { type: n.type, className: classes[n.type] }
      );
      storeDisplayed(n.uuid);
    });
  }, [alerts]);

  return null;
};

export default inject('notificationStore')(observer(Notifier));
