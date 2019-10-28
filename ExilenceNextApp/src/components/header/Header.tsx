import { AppBar, makeStyles, Theme, Toolbar } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CloseIcon from '@material-ui/icons/Close';
import FilterNone from '@material-ui/icons/FilterNone';
import MinimizeIcon from '@material-ui/icons/Minimize';
import clsx from 'clsx';
import React from 'react';

import { WindowHelper } from './../../helpers/window.helper';

export const resizeHandleContainerHeight = 5;
export const toolbarHeight = 30;

const useStyles = makeStyles((theme: Theme) => ({
  toolbar: {
    minHeight: toolbarHeight,
    maxHeight: toolbarHeight,
    '-webkit-app-region': 'drag',
    paddingBottom: resizeHandleContainerHeight
  },
  resizeHandleContainer: {
    height: resizeHandleContainerHeight
  },
  noDrag: {
    '-webkit-app-region': 'no-drag'
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
  setMaximized: Function;
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
  const classes = useStyles();

  return (

    <AppBar position="fixed" color="secondary">
      <div className={clsx(classes.noDrag, classes.resizeHandleContainer)}></div>
      <Toolbar className={classes.toolbar}>
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
        >
          <Grid item className={clsx(classes.noDrag)}>
            <MinimizeIcon className={classes.windowIcon} onClick={() => WindowHelper.minimize()} />
            {!props.maximized ? (
              <CheckBoxOutlineBlankIcon className={classes.windowIcon} onClick={() => { WindowHelper.maximize(); props.setMaximized(true); }} />
              ) : (
              <FilterNone className={classes.windowIcon} onClick={() => { WindowHelper.unmaximize(); props.setMaximized(false); }} />
              )}
            <CloseIcon className={classes.windowIcon} onClick={() => WindowHelper.close()} />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
