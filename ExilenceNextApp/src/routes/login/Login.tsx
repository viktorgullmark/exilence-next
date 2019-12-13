import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import LoginContentContainer from '../../components/login-content/LoginContentContainer';
import { observer } from 'mobx-react';
import { visitor, appName } from '../..';

const useStyles = makeStyles(theme => ({
  loginWrapper: {
    display: 'flex',
    height: '100%'
  }
}));

const Login: React.FC = () => {
  useEffect(() => {
    visitor!.pageview('/login', appName).send();
  })

  const classes = useStyles();
  return (
    <div className={classes.loginWrapper}>
      <LoginContentContainer />
    </div>
  );
};

export default observer(Login);
