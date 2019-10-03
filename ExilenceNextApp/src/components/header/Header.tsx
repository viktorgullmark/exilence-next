import { AppBar, Button, makeStyles, Toolbar } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import clsx from 'clsx';

const resizeHandleContainerHeight = 5;
const toolbarHeight = 30;

const useStyles = makeStyles({
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
  }
});

const Header: React.FC = () => {

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
          {/* <Grid item className={classes.noDrag}>
            <Button color="inherit" size="small">
              Login
              </Button>
          </Grid> */}
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
