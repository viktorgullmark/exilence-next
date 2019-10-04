import { AppBar, Button, makeStyles, Toolbar, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React, { useState } from 'react';
import clsx from 'clsx';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import MinimizeIcon from '@material-ui/icons/Minimize';
import CloseIcon from '@material-ui/icons/Close';
import FilterNone from '@material-ui/icons/FilterNone';
import { WindowHelper } from './../../helpers/window.helper';

const resizeHandleContainerHeight = 5;
const toolbarHeight = 30;

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

const Header: React.FC = () => {
  const classes = useStyles();
  const [maximized, setMaximized] = useState(false);

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
            {!maximized ? (
              <CheckBoxOutlineBlankIcon className={classes.windowIcon} onClick={() => { WindowHelper.maximize(); setMaximized(true); }} />
              ) : (
              <FilterNone className={classes.windowIcon} onClick={() => { WindowHelper.unmaximize(); setMaximized(false); }} />
              )}
            <CloseIcon className={classes.windowIcon} onClick={() => WindowHelper.close()} />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
