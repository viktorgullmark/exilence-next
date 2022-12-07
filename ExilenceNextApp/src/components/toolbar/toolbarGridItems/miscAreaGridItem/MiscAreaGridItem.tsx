import React from 'react';
import { Grid, IconButton, Tooltip, Badge } from '@mui/material';
import useStyles from './MiscAreaGridItem.styles';
import { useTranslation } from 'react-i18next';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Notification } from '../../../../store/domains/notification';

type MiscAreaGridItemProps = {
  isInitiating: boolean;
  isSnapshotting: boolean;
  unreadNotifications: Notification[];
  handleNotificationsOpen: (event: React.MouseEvent<HTMLElement>) => void;
  handleAccountMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
};

const MiscAreaGridItem = ({
  isInitiating,
  isSnapshotting,
  unreadNotifications,
  handleNotificationsOpen,
  handleAccountMenuOpen,
}: MiscAreaGridItemProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid item className={classes.miscArea}>
      <Tooltip title={t('label.notification_icon_title') || ''} placement="bottom">
        <span>
          <IconButton
            data-tour-elem="notificationList"
            onClick={(e) => handleNotificationsOpen(e)}
            aria-label="show new notifications"
            color="inherit"
            className={classes.iconButton}
            size="large"
          >
            <Badge
              max={9}
              badgeContent={unreadNotifications.length > 0 ? unreadNotifications.length : undefined}
              classes={{ badge: classes.badge }}
            >
              <NotificationsIcon fontSize="small" />
            </Badge>
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={t('label.account_icon_title') || ''} placement="bottom">
        <span>
          <IconButton
            onClick={(e) => handleAccountMenuOpen(e)}
            aria-label="account"
            aria-haspopup="true"
            disabled={isSnapshotting || isInitiating}
            className={classes.iconButton}
            size="large"
          >
            <AccountCircle fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Grid>
  );
};

export default MiscAreaGridItem;
