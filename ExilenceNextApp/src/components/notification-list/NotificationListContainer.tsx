import React from 'react';
import { inject, observer } from 'mobx-react';

import { UiStateStore } from '../../store/uiStateStore';
import NotificationList from './NotificationList';

type NotificationListContainerProps = {
  uiStateStore?: UiStateStore;
};

const NotificationListContainer = ({ uiStateStore }: NotificationListContainerProps) => {
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

export default inject('notificationStore', 'uiStateStore')(observer(NotificationListContainer));
