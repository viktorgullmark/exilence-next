import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import LoginStepperContainer from '../../components/login-stepper/LoginStepperContainer';
import { observer } from 'mobx-react';

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
            <LoginStepperContainer />
        </div>
    );
}

export default observer(Login);

