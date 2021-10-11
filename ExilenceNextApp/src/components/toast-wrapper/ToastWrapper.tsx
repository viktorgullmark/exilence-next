import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useLocation } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { useStores } from '../..';
import useStyles from './ToastWrapper.styles';

const ToastWrapper = () => {
  const { uiStateStore } = useStores();
  const classes = useStyles();
  const location = useLocation();

  return (
    <ToastContainer
      theme="dark"
      className={clsx(classes.root, {
        [classes.authorized]: location.pathname !== '/login',
        [classes.rightMargin]: uiStateStore!.groupOverviewOpen,
      })}
    />
  );
};

export default observer(ToastWrapper);
