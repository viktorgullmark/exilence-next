import React from 'react';
import { Notification } from '../../../store/domains/notification';
import {
  ListItem,
  makeStyles,
  Theme,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import { t } from 'i18next';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props {
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
    display: 'inline'
  }
}));

const NotificationListItem: React.FC<Props> = ({ notification }: Props) => {
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
    <ListItem key={notification.uuid} className={classes.notification}>
      <ListItemAvatar>
        <Avatar>{Icon(notification.type)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={t(notification.title, { param: notification.translateParam })}
        secondary={
          <>
            <Typography
              component="span"
              variant="body2"
              className={classes.timestamp}
            >
              {moment(notification.timestamp).format('MM-DD, LT')}
            </Typography>
            {/* temporary disabled {` — ${t(notification.description, { param: notification.translateParam })}`} */}
          </>
        }
      />
    </ListItem>
  );
};

export default NotificationListItem;
