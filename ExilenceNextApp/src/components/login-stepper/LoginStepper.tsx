import { Step, StepLabel, Stepper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { observer } from 'mobx-react';
import { LoginStepConnector } from './login-step-connector/LoginStepConnector';
import { LoginStepIcons } from './login-step-icons/LoginStepIcons';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { IFormInput } from '../../interfaces/form-input.interface';
import AccountValidationStep from './account-validation-step/AccountValidationStep';
import LeagueSelectionStep from './league-selection-step/LeagueSelectionStep';
import CharacterSelectionStep from './character-selection-step/CharacterSelectionStep';
import { IAccount } from './../../interfaces/account.interface';

interface LoginStepperProps {
  handleValidate: Function;
  handleLeagueSubmit: Function;
  handleBack: Function;
  handleReset: Function;
  steps: string[];
  activeStep: number;
  sessionId: IFormInput;
  accountName: IFormInput;
}

const useStyles = makeStyles((theme: Theme)  => ({
  stepperContainer: {
    'box-shadow': '0px 0px 32px 1px rgba(0,0,0,0.77)',
    borderRadius: 0
  },
  stepContent: {},
  stepMainContent: {
    minHeight: 240
  },
  stepFooter: {
    marginTop: theme.spacing(2)
  }
}));

const LoginStepper: React.FC<LoginStepperProps> = (
  props: LoginStepperProps
) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <AccountValidationStep
            handleValidate={(details: IAccount) => props.handleValidate(details)}
            handleBack={() => props.handleBack()}
            activeStep={props.activeStep}
            styles={classes}
          />
        );
      case 1:
        return (
          <LeagueSelectionStep
            handleLeagueSubmit={() => props.handleLeagueSubmit()}
            handleBack={() => props.handleBack()}
            handleReset={() => props.handleReset()}
            activeStep={props.activeStep}
            styles={classes}
          />
        );
      case 2:
        return <CharacterSelectionStep />;
      default:
        return '';
    }
  };

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item sm={9} md={7} lg={6}>
        <Paper className={clsx('paper', classes.stepperContainer)}>
          <Box p={2}>
            <Stepper
              alternativeLabel
              activeStep={props.activeStep}
              connector={<LoginStepConnector />}
            >
              {props.steps.map((label: string) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={LoginStepIcons}>
                    {label}
                  </StepLabel>
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
                <div className={classes.stepContent}>
                  {getStepContent(props.activeStep)}
                </div>
              )}
            </div>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default observer(LoginStepper);
