import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import LoginContentContainer from '../../components/login-content/LoginContentContainer';
import { observer } from 'mobx-react';
import { visitor, appName } from '../..';
import Image from '../../assets/img/conquerorsoftheatlas-bg.jpg';

const useStyles = makeStyles(theme => ({
  loginWrapper: {
    display: 'flex',
    height: '100vh',
    background: `linear-gradient(rgba(16, 16, 16, 0.8), rgba(16, 16, 16, 0.8)), url(${Image})`
  }
}));

const Login: React.FC = () => {
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
