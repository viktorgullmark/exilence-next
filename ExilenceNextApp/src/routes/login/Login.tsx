import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import LoginFormContainer from '../../components/login-form/LoginFormContainer';
import { useStateValue } from '../../state';

const useStyles = makeStyles(theme => ({
    loginWrapper: {
        display: "flex",
        height: "100%"
    }
}));

const Login: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.loginWrapper}>
            <LoginFormContainer />
        </div>
    );
}

export default Login;
