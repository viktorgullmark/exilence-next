import { Menu } from '@material-ui/core';
import React from 'react';
import { Notification } from '../../store/domains/notification';
import NotificationListItem from './notification-list-item/NotificationListItem';

interface Props {
  notificationList: Notification[];
  open: boolean;
  notificationListAnchor: HTMLElement | null;
  handleListClose: () => void;
}

const NotificationList: React.FC<Props> = ({
  notificationList,
  open,
  handleListClose,
  notificationListAnchor,
}: Props) => {
  return (
    <Menu
      anchorEl={notificationListAnchor}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id='notifications-menu'
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
