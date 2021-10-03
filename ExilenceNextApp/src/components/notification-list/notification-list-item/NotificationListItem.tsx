import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import moment from 'moment';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Notification } from '../../../store/domains/notification';
import useStyles from './NotificationListItem.styles';

interface Props {
  children?: ReactNode;
  notification: Notification;
}

const NotificationListItem = (props: Props) => {
  const { notification } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  const Icon = (type: string) => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <ListItem key={notification.uuid} className={classes.notification}>
      <ListItemAvatar>
        <Avatar classes={{ colorDefault: classes.avatarColor }}>{Icon(notification.type)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        classes={{
          primary: classes.notificationItem,
          secondary: classes.secondary,
        }}
        primary={t(notification.title, { param: notification.translateParam })}
        secondary={
          <>
            <Typography component="span" variant="body2" className={classes.timestamp}>
              {moment(notification.timestamp).fromNow()}
            </Typography>
            <Typography component="span" variant="body2" className={classes.description}>
              {` — ${t(notification.description, {
                param: notification.translateParam,
              })}`}
            </Typography>
          </>
        }
      />
    </ListItem>
  );
};

NotificationListItem.displayName = 'NotificationListItem';

export default NotificationListItem;
