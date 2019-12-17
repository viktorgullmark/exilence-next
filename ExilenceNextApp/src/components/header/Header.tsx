import { AppBar, Toolbar } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CloseIcon from '@material-ui/icons/Close';
import FilterNone from '@material-ui/icons/FilterNone';
import MinimizeIcon from '@material-ui/icons/Minimize';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IGithubRelease } from '../../interfaces/github/github-release.interface';
import { WindowUtils } from '../../utils/window.utils';

export const resizeHandleContainerHeight = 5;
export const toolbarHeight = 30;

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    zIndex: 1290,
    backgroundColor: theme.palette.secondary.dark
  },
  title: {
    flexGrow: 1,
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '4px',
    color: theme.palette.primary.light,
    fontWeight: 700
  },
  version: {
    flexGrow: 1,
    color: theme.palette.text.hint
  },
  toolbar: {
    minHeight: toolbarHeight,
    maxHeight: toolbarHeight,
    '-webkit-app-region': 'drag',
    paddingBottom: resizeHandleContainerHeight
  },
  menuButton: {},
  hide: {
    display: 'none'
  },
  resizeHandleContainer: {
    height: resizeHandleContainerHeight
  },
  noDrag: {
    '-webkit-app-region': 'no-drag',
    cursor: 'pointer'
  },
  windowHandlerButton: {
    display: 'flex',
    alignItems: 'center',
    width: 40,
    justifyContent: 'center',
    height: resizeHandleContainerHeight + toolbarHeight,
    '&:hover': {
      backgroundColor: theme.palette.background.paper
    }
  },
  exit: {
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },
  windowHandlers: {
    display: 'flex',
    alignItems: 'center'
  },
  windowIcon: {
    fontSize: 14,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    cursor: 'pointer'
  }
}));

interface HeaderProps {
  maximized: boolean;
  sidenavOpened: boolean;
  setMaximized: (maximized: boolean) => void;
  toggleSidenav: () => void;
  currentVersion: string;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <AppBar position="fixed" color="secondary" className={classes.header}>
      <div
        className={clsx(classes.noDrag, classes.resizeHandleContainer)}
      ></div>
      <Toolbar className={classes.toolbar}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Typography variant="h6" noWrap className={classes.title}>
                  Exilence Next
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="subtitle2"
                  noWrap
                  className={classes.version}
                >
                  v.{props.currentVersion}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid
                item
                className={clsx(classes.noDrag, classes.windowHandlerButton)}
                onClick={() => WindowUtils.minimize()}
              >
                <MinimizeIcon className={classes.windowIcon} />
              </Grid>
              <Grid
                item
                className={clsx(classes.noDrag, classes.windowHandlerButton)}
                onClick={
                  !props.maximized
                    ? () => {
                        WindowUtils.maximize();
                        props.setMaximized(true);
                      }
                    : () => {
                        WindowUtils.unmaximize();
                        props.setMaximized(false);
                      }
                }
              >
                {!props.maximized ? (
                  <CheckBoxOutlineBlankIcon className={classes.windowIcon} />
                ) : (
                  <FilterNone className={classes.windowIcon} />
                )}
              </Grid>
              <Grid
                item
                className={clsx(
                  classes.noDrag,
                  classes.windowHandlerButton,
                  classes.exit
                )}
                onClick={() => WindowUtils.close()}
              >
                <CloseIcon className={classes.windowIcon} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default observer(Header);
