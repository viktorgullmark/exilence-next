import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import LoginStepperContainer from '../../components/login-stepper/LoginStepperContainer';
import Image from '../../assets/img/blight-bg.jpg';
import { observer } from 'mobx-react';

const useStyles = makeStyles(theme => ({
    loginWrapper: {
        display: "flex",
        height: "100%",
        background: `linear-gradient(rgba(16, 16, 16, 0.8), rgba(16, 16, 16, 0.8)), url(${Image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
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

