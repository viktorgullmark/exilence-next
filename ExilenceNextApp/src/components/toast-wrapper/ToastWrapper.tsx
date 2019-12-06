import { ToastContainer } from 'react-toastify';
import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core';
import { toolbarHeight, resizeHandleContainerHeight } from '../header/Header';
import { innerToolbarHeight } from '../toolbar/Toolbar';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    top:
      toolbarHeight +
      resizeHandleContainerHeight +
      innerToolbarHeight +
      theme.spacing(2)
  }
}));

const ToastWrapper: React.FC = () => {
  const classes = useStyles();

  return <ToastContainer className={classes.root} />;
};

export default ToastWrapper;
