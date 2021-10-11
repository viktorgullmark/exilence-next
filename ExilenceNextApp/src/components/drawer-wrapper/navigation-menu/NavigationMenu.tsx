import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BurstModeIcon from '@mui/icons-material/BurstMode';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import useStyles from './NavigationMenu.styles';

type NavigationMenuProps = {
  open: boolean;
  toggleSidenav: () => void;
  handleRedirect: (path: string) => void;
};

const NavigationMenu = ({ open, toggleSidenav, handleRedirect }: NavigationMenuProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <Drawer
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx(classes.drawerPaper, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
      variant="permanent"
      anchor="left"
      color="secondary"
      open={open}
      transitionDuration={0}
    >
      <div className={clsx(classes.drawerHeader, { [classes.drawerHeaderOpen]: open })}>
        <IconButton onClick={() => toggleSidenav()} size="large">
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem
          button
          key="net-worth"
          data-tour-elem="netWorthView"
          selected={location.pathname === '/net-worth'}
          onClick={() => handleRedirect('/net-worth')}
        >
          <ListItemIcon>
            <Tooltip title={t('title.net_worth') || ''} placement="right">
              <AttachMoneyIcon />
            </Tooltip>
          </ListItemIcon>
          <ListItemText primary={t('title.net_worth')} />
        </ListItem>
        <ListItem
          button
          key="bulk-selling"
          data-tour-elem="bulkSellView"
          selected={location.pathname === '/bulk-sell'}
          onClick={() => handleRedirect('/bulk-sell')}
        >
          <Typography className={classes.new}>BETA</Typography>
          <ListItemIcon>
            <Tooltip title={t('title.bulk_sell') || ''} placement="right">
              <BurstModeIcon />
            </Tooltip>
          </ListItemIcon>
          <ListItemText primary={t('title.bulk_sell')} />
        </ListItem>
        <ListItem
          button
          key="settings"
          data-tour-elem="settingsView"
          selected={location.pathname === '/settings'}
          onClick={() => handleRedirect('/settings')}
        >
          <ListItemIcon>
            <Tooltip title={t('title.settings') || ''} placement="right">
              <SettingsIcon />
            </Tooltip>
          </ListItemIcon>
          <ListItemText primary={t('title.settings')} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default observer(NavigationMenu);
