import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SettingsIcon from '@material-ui/icons/Settings';
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
        <IconButton onClick={() => toggleSidenav()}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem
          button
          key="net-worth"
          selected={location.pathname === '/net-worth'}
          onClick={() => handleRedirect('/net-worth')}
        >
          <ListItemIcon>
            <AttachMoneyIcon />
          </ListItemIcon>
          <ListItemText primary={t('title.net_worth')} />
        </ListItem>
        <ListItem
          button
          key="settings"
          selected={location.pathname === '/settings'}
          onClick={() => handleRedirect('/settings')}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t('title.settings')} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default observer(NavigationMenu);
