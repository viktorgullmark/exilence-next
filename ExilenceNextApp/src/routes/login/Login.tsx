import React, { useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { observer } from 'mobx-react-lite';

import { appName, visitor } from '../..';
import Image from '../../assets/img/scourge-bg.jpg';
import LoginContentContainer from '../../components/login-content/LoginContentContainer';

const useStyles = makeStyles(() => ({
  loginWrapper: {
    display: 'flex',
    height: '100vh',
    background: `linear-gradient(rgba(16, 16, 16, 0.8), rgba(16, 16, 16, 0.8)), url(${Image})`,
    backgroundSize: 'cover',
  },
}));

const Login = () => {
  useEffect(() => {
    visitor!.pageview('/login', appName).send();
  });

  const classes = useStyles();
  return (
    <div className={classes.loginWrapper}>
      <LoginContentContainer />
    </div>
  );
};

export default observer(Login);
