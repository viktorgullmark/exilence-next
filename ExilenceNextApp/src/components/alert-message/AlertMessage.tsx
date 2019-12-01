import { inject, observer } from 'mobx-react';
import React, { SyntheticEvent } from 'react';
import { NotificationStore } from '../../store/notificationStore';
import { UiStateStore } from '../../store/uiStateStore';
import {
  Snackbar,
  SnackbarContent,
  Icon,
  IconButton,
  makeStyles
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { green, amber } from '@material-ui/core/colors';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from 'clsx';
import { Notification } from '../../store/domains/notification';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  },
  margin: {
    margin: theme.spacing(1)
  }
}));

interface AlertMessageProps {
  uiStateStore?: UiStateStore;
  notificationStore?: NotificationStore;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  uiStateStore,
  notificationStore
}: AlertMessageProps) => {
  const classes = useStyles();
  const notification = uiStateStore!.alertNotification;
  const handleClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    uiStateStore!.closeAlert();
  };
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      open={uiStateStore!.alertOpen}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      {notification && (
        <SnackbarContent
          className={clsx(classes[notification.type], classes.margin)}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              <Icon className={clsx(classes.icon, classes.iconVariant)} />
              {notification.title}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>
          ]}
        />
      )}
    </Snackbar>
  );
};

export default inject(
  'uiStateStore',
  'notificationStore'
)(observer(AlertMessage));
