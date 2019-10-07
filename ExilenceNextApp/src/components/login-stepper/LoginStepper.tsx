import { Step, StepLabel, Stepper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import { LoginStepConnector } from './login-step/LoginStepConnector';
import { LoginStepIcons } from './login-step/LoginStepIcons';
import clsx from 'clsx';

interface LoginStepperProps {
  handleLogin: Function;
  sessionId: any;
  accountName: any;
}

function getSteps() {
  return ['Enter account information', 'Select your league', 'Select your characters'];
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return '';
    case 1:
      return '';
    case 2:
      return '';
    default:
      return '';
  }
}

const useStyles = makeStyles({
  stepperContainer: {
    'box-shadow': '0px 0px 32px 1px rgba(0,0,0,0.77)',
    borderRadius: 0
  },
  stepContent: {
    height: 200
  }
});

const LoginStepper: React.FC<LoginStepperProps> = (props: LoginStepperProps) => {
  const [activeStep, setActiveStep] = React.useState(1);
  const steps = getSteps();
  const classes = useStyles();

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    props.handleLogin();
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <Grid container
      direction="row"
      justify="center"
      alignItems="center">
      <Grid item sm={9} md={7} lg={6}>
        <Paper className={clsx('paper', classes.stepperContainer)}>
          <Box p={2}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<LoginStepConnector />}>
              {steps.map(label => (
                <Step key={label}>
                  <StepLabel StepIconComponent={LoginStepIcons}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div>
              {activeStep === steps.length ? (
                <div>
                  <Typography>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Button onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              ) : (
                  <div>
                    <div className={classes.stepContent}>
                      {getStepContent(activeStep)}
                    </div>
                    <div>
                      <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default LoginStepper;
