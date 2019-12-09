import { inject, observer } from 'mobx-react';
import React from 'react';
import { NotificationStore } from '../../store/notificationStore';
import { UiStateStore } from '../../store/uiStateStore';
import NotificationList from './NotificationList';

interface Props {
  notificationStore?: NotificationStore;
  uiStateStore?: UiStateStore;
}

const NotificationListContainer: React.FC<Props> = ({
  uiStateStore,
  notificationStore
}: Props) => {
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
