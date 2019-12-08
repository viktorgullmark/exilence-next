import React from 'react';

interface Props {
  notifications: Notification[];
  unreadNotifications: Notification[];
  markAllNotificationsRead: () => void;
  handleListOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleListClose: () => void;
}

const NotificationList: React.FC<Props> = ({
  notifications,
  unreadNotifications,
  markAllNotificationsRead
}: Props) => {
  return <></>;
};

export default NotificationList;
