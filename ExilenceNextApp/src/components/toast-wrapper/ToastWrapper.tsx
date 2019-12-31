import { ToastContainer } from 'react-toastify';
import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core';
import { toolbarHeight, resizeHandleContainerHeight } from '../header/Header';
import { innerToolbarHeight } from '../toolbar/Toolbar';
import { useLocation } from 'react-router';
import clsx from 'clsx';
import { drawerWidth } from '../drawer-wrapper/DrawerWrapper';
import { UiStateStore } from '../../store/uiStateStore';
import { observer, inject } from 'mobx-react';

interface Props {
  uiStateStore?: UiStateStore;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    top: toolbarHeight + resizeHandleContainerHeight + theme.spacing(2),
    width: 350
  },
  authorized: {
    top:
      toolbarHeight +
      resizeHandleContainerHeight +
      innerToolbarHeight +
      theme.spacing(2)
  },
  rightMargin: {
    right: drawerWidth + theme.spacing(2)
  }
}));

const ToastWrapper: React.FC<Props> = ({ uiStateStore }: Props) => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <ToastContainer
      className={clsx(classes.root, {
        [classes.authorized]: location.pathname !== '/login',
        [classes.rightMargin]: uiStateStore!.groupOverviewOpen
      })}
    />
  );
};

export default inject('uiStateStore')(observer(ToastWrapper));

