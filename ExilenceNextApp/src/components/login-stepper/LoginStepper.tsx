import { Step, StepLabel, Stepper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { observer } from 'mobx-react'
import { LoginStepConnector } from './login-step/LoginStepConnector';
import { LoginStepIcons } from './login-step/LoginStepIcons';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { IFormInput } from '../../interfaces/form-input.interface';

interface LoginStepperProps {
  handleNext: Function;
  handleBack: Function;
  handleReset: Function;
  getStepContent: Function;
  steps: string[];
  activeStep: number;
  sessionId: IFormInput;
  accountName: IFormInput;
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

  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid container
      direction="row"
      justify="center"
      alignItems="center">
      <Grid item sm={9} md={7} lg={6}>
        <Paper className={clsx('paper', classes.stepperContainer)}>
          <Box p={2}>
            <Stepper alternativeLabel activeStep={props.activeStep} connector={<LoginStepConnector />}>
              {props.steps.map((label: string) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={LoginStepIcons}>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div>
              {props.activeStep === props.steps.length ? (
                <div>
                  <Typography>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Button onClick={() => props.handleReset()}>
                    {t('action.reset')}
                  </Button>
                </div>
              ) : (
                  <div>
                    <div className={classes.stepContent}>
                      {props.getStepContent(props.activeStep)}
                    </div>
                    <div>
                      <Button disabled={props.activeStep === 0} onClick={() => props.handleBack()}>
                        {t('action.back')}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => props.handleNext()}
                      >
                        {props.activeStep === props.steps.length - 1 ? t('action.finish') : t('action.next')}
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

export default observer(LoginStepper);