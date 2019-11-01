import {
  Drawer,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import React from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PersonIcon from '@material-ui/icons/Person';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { toolbarHeight, resizeHandleContainerHeight } from '../header/Header';

export const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    height: '100%',
    padding: `calc(${toolbarHeight}px + ${resizeHandleContainerHeight}px + ${theme.spacing(2)}px) 
    ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
  },
}));

interface SideNavProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  toggleSidenav: Function;
}

const SideNav: React.FC<SideNavProps> = ({
  open,
  toggleSidenav,
  children
}: SideNavProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
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
          <ListItem button key="net-worth">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={t('net-worth')} />
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}
      >
        {children}
      </main>
    </>
  );
};

export default observer(SideNav);
