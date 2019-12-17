import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box
} from '@material-ui/core';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PersonIcon from '@material-ui/icons/Person';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { resizeHandleContainerHeight, toolbarHeight } from '../header/Header';
import { innerToolbarHeight } from './../toolbar/Toolbar';
import SettingsIcon from '@material-ui/icons/Settings';
import DiscordLogo from '../../assets/img/discord-logo-white.svg';
import { WindowUtils } from '../../utils/window.utils';

export const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    height: `calc(100% - ${toolbarHeight}px)`,
    top: `calc(${toolbarHeight}px + ${resizeHandleContainerHeight}px)`,
    width: drawerWidth
  },
  drawerHeader: {
    background: theme.palette.secondary.main,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-end'
  },
  content: {
    height: `calc(100% - ${toolbarHeight}px)`,
    padding: `calc(${toolbarHeight}px + ${innerToolbarHeight}px + ${resizeHandleContainerHeight}px + ${theme.spacing(
      2
    )}px) 
    ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: 0
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: drawerWidth
  },
  discordLogo: {
    height: 60,
    position: 'absolute',
    bottom: theme.spacing(2)
  }
}));

interface SideNavProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  toggleSidenav: () => void;
}

const SideNav: React.FC<SideNavProps> = ({
  open,
  toggleSidenav,
  children
}: SideNavProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const location = useLocation();

  const atLoginRoute = () => {
    return location.pathname === '/login';
  };

  return (
    <>
      {!atLoginRoute() && (
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
              component={Link}
              to="/net-worth"
              selected={location.pathname === '/net-worth'}
            >
              <ListItemIcon>
                <AttachMoneyIcon />
              </ListItemIcon>
              <ListItemText primary={t('title.net_worth')} />
            </ListItem>
            <ListItem
              button
              key="settings"
              component={Link}
              to="/settings"
              selected={location.pathname === '/settings'}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary={t('title.settings')} />
            </ListItem>
          </List>
          <a
            href="https://discord.gg/yxuBrPY"
            onClick={e => WindowUtils.openLink(e)}
          >
            <Box display="flex" justifyContent="center">
              <img className={classes.discordLogo} src={DiscordLogo} />
            </Box>
          </a>
        </Drawer>
      )}
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open && !atLoginRoute()
        })}
      >
        {children}
      </main>
    </>
  );
};

export default observer(SideNav);
