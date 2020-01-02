import React, { ReactNode, forwardRef } from 'react';
import { Notification } from '../../../store/domains/notification';
import {
  ListItem,
  makeStyles,
  Theme,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import { t } from 'i18next';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props {
  children?: ReactNode;
  notification: Notification;
}

const useStyles = makeStyles((theme: Theme) => ({
  notification: {
    paddingTop: 0,
    paddingBottom: theme.spacing(0.25),
    '&:focus': {
      outline: 'none'
    }
  },
  timestamp: {
    display: 'inline',
    fontSize: '12px',
    color: theme.palette.primary.light
  },
  description: {
    fontSize: '0.75rem'
  },
  notificationItem: {
    fontSize: '14px'
  },
  secondary: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: 400,
    textOverflow: 'ellipsis'
  }
}));

const NotificationListItem = forwardRef((props: Props, ref) => {
  const { notification } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  const Icon = (type: string) => {
    switch (type) {
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };
  return (
    <ListItem
      key={notification.uuid}
      className={classes.notification}
      innerRef={ref}
    >
      <ListItemAvatar>
        <Avatar>{Icon(notification.type)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        classes={{
          primary: classes.notificationItem,
          secondary: classes.secondary
        }}
        primary={t(notification.title, { param: notification.translateParam })}
        secondary={
          <>
            <Typography
              component="span"
              variant="body2"
              className={classes.timestamp}
            >
              {moment(notification.timestamp).fromNow()}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              className={classes.description}
            >
              {` — ${t(notification.description, {
                param: notification.translateParam
              })}`}
            </Typography>
          </>
        }
      />
    </ListItem>
  );
});

NotificationListItem.displayName = 'NotificationListItem';

export default NotificationListItem;
