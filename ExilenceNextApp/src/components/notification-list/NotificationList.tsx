import React from 'react';
import { Menu } from '@mui/material';

import { Notification } from '../../store/domains/notification';
import NotificationListItem from './notification-list-item/NotificationListItem';

type NotificationListProps = {
  notificationList: Notification[];
  open: boolean;
  notificationListAnchor: HTMLElement | null;
  handleListClose: () => void;
};

const NotificationList = ({
  notificationList,
  open,
  handleListClose,
  notificationListAnchor,
}: NotificationListProps) => {
  return (
    <Menu
      anchorEl={notificationListAnchor}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="notifications-menu"
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      onClose={handleListClose}
    >
      {notificationList.map((n) => {
        return <NotificationListItem key={n.uuid} notification={n} />;
      })}
    </Menu>
  );
};

export default NotificationList;
