import { Box, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SettingsIcon from '@material-ui/icons/Settings';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { WindowUtils } from '../../../utils/window.utils';
import { resizeHandleContainerHeight, toolbarHeight } from '../../header/Header';
import { drawerWidth } from '../DrawerWrapper';

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    height: `calc(100% - ${toolbarHeight}px)`,
    top: `calc(${toolbarHeight}px + ${resizeHandleContainerHeight}px)`,
    width: drawerWidth,
    background: theme.palette.background.default
  },
  drawerHeader: {
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-end'
  }
}));

interface NavigationMenuProps {
  open: boolean;
  toggleSidenav: () => void;
  handleRedirect: (path: string) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
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
