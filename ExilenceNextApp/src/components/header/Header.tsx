import { AppBar, Button, makeStyles, Toolbar } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import React from 'react';

const useStyles = makeStyles({
  toolbar: {
    minHeight: 40
  },
});

const Header: React.FC = () => {

  const classes = useStyles();

  return (
    <AppBar position="fixed">
      <Toolbar className={classes.toolbar}>
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
        >
          <Grid item>
            <Button color="inherit">
              Login
              </Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
