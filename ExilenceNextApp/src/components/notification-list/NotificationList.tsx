import { Menu } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Notification } from '../../store/domains/notification';
import NotificationListItem from './notification-list-item/NotificationList';

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
  notificationListAnchor
}: Props) => {
  const { t } = useTranslation();
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
      {notificationList.map(n => {
        return <NotificationListItem key={n.uuid} notification={n} />;
      })}
    </Menu>
  );
};

export default NotificationList;
