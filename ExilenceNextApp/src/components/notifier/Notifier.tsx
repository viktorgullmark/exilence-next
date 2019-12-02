import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { useEffect, useMemo } from 'react';
import { NotificationStore } from '../../store/notificationStore';
import { UiStateStore } from './../../store/uiStateStore';
import { useSnackbar } from 'notistack';

interface NotifierProps {
  uiStateStore?: UiStateStore;
  notificationStore?: NotificationStore;
}

const Notifier: React.FC<NotifierProps> = ({
  uiStateStore,
  notificationStore
}: NotifierProps) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (uuid: string) => {
    notificationStore!.addDisplayed(uuid);
  };

  const alerts = notificationStore!.alertNotifications;

  useMemo(() => {
    alerts.forEach(n => {
      if (notificationStore!.displayed.find(d => d === n.uuid) !== undefined) return;
      enqueueSnackbar(n.title, { variant: n.type, preventDuplicate: true });
      storeDisplayed(n.uuid);
    });
  }, [alerts]);

  return null;
};

export default inject('uiStateStore', 'notificationStore')(observer(Notifier));
