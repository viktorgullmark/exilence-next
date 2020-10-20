import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SettingsIcon from '@material-ui/icons/Settings';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import useStyles from './NavigationMenu.styles';

type NavigationMenuProps = {
  open: boolean;
  toggleSidenav: () => void;
  handleRedirect: (path: string) => void;
}

const NavigationMenu = ({
  open,
  toggleSidenav,
  handleRedirect
}: NavigationMenuProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      color="secondary"
      open={open}
      transitionDuration={0}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={() => toggleSidenav()}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
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
