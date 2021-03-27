import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../..';
import NotificationList from './NotificationList';

const NotificationListContainer = () => {
  const { uiStateStore } = useStores();
  const listOpen = Boolean(uiStateStore!.notificationListAnchor);

  const handleListClose = () => {
    uiStateStore!.setNotificationListAnchor(null);
  };

  return (
    <NotificationList
      notificationList={uiStateStore!.notificationList}
      open={listOpen}
      notificationListAnchor={uiStateStore!.notificationListAnchor}
      handleListClose={handleListClose}
    />
  );
};

export default observer(NotificationListContainer);
