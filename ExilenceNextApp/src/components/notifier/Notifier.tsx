import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useStores } from '../..';
import ToastContent from '../toast-content/ToastContent';
import useStyles from './Notifier.styles';

const Notifier = () => {
  const { notificationStore } = useStores();
  const { t } = useTranslation();
  const classes = useStyles();

  const storeDisplayed = (uuid: string) => {
    notificationStore!.addDisplayed(uuid);
  };

  const alerts = notificationStore!.alertNotifications;

  useMemo(() => {
    alerts.forEach((n) => {
      if (notificationStore!.displayed.find((d) => d === n.uuid) !== undefined) return;
      toast(
        () => (
          <ToastContent
            message={t(n.title, n.translateParam ? { param: n.translateParam } : undefined)}
            description={t(n.description)}
          />
        ),
        { type: n.type, className: classes.default }
      );
      storeDisplayed(n.uuid);
    });
  }, [alerts]);

  return null;
};

export default observer(Notifier);
