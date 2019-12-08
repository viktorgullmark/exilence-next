import {
  makeStyles,
  Theme,
  Menu,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography
} from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { Notification } from '../../store/domains/notification';
import { NotificationStore } from '../../store/notificationStore';
import WarningIcon from '@material-ui/icons/Warning';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { UiStateStore } from '../../store/uiStateStore';

interface Props {
  notificationStore?: NotificationStore;
  uiStateStore?: UiStateStore;
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

const NotificationListContainer: React.FC<Props> = ({
  uiStateStore
}: Props) => {
  const classes = useStyles();

  const { t } = useTranslation();
  const listOpen = Boolean(uiStateStore!.notificationListAnchor);

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

  const handleMenuClose = () => {
    uiStateStore!.setNotificationListAnchor(null);
  };

  return (
    <Menu
      anchorEl={uiStateStore!.notificationListAnchor}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id="notifications-menu"
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={listOpen}
      onClose={handleMenuClose}
    >
      {uiStateStore!.notificationList.map(n => {
        return (
          <ListItem key={n.uuid} className={classes.notification}>
            <ListItemAvatar>
              <Avatar>{Icon(n.type)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t(n.title, { param: n.translateParam })}
              secondary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.timestamp}
                  >
                    {moment(n.timestamp).format('MM-DD, LT')}
                  </Typography>
                  {/* temporary disabled {` — ${t(n.description, { param: n.translateParam })}`} */}
                </>
              }
            />
          </ListItem>
        );
      })}
    </Menu>
  );
};

export default inject(
  'notificationStore',
  'uiStateStore'
)(observer(NotificationListContainer));
