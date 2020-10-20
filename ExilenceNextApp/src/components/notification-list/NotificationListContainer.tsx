import { inject, observer } from 'mobx-react';
import React from 'react';
import { NotificationStore } from '../../store/notificationStore';
import { UiStateStore } from '../../store/uiStateStore';
import NotificationList from './NotificationList';

type NotificationListContainerProps = {
  notificationStore?: NotificationStore;
  uiStateStore?: UiStateStore;
}

const NotificationListContainer = ({
  uiStateStore,
  notificationStore
}: NotificationListContainerProps) => {
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

export default inject(
  'notificationStore',
  'uiStateStore'
)(observer(NotificationListContainer));
