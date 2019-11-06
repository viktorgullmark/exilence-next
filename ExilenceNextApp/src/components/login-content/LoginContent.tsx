import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Account } from '../../store/domains/account';
import { League } from '../../store/domains/league';
import { IAccount } from '../../interfaces/account.interface';
import { Character } from '../../store/domains/character';
import AccountValidationForm from './account-validation-form/AccountValidationForm';
import Typography from '@material-ui/core/Typography';

interface LoginContentProps {
  handleValidate: Function;
  handleLeagueSubmit: Function;
  handleLeagueChange: Function;
  selectedLeague?: string;
  selectedPriceLeague?: string;
  characters: Character[];
  leagues: League[];
  priceLeagues: League[];
  isSubmitting: boolean;
  account: Account;
}

const useStyles = makeStyles((theme: Theme) => ({
  loginContentContainer: {
    'box-shadow': '0px 0px 32px 1px rgba(0,0,0,0.77)',
    borderRadius: 0,
    padding: theme.spacing(5, 5)
  },
  loginTitle: {
    marginTop: 0,
    marginBottom: theme.spacing(7),
    textTransform: 'uppercase',
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.primary.main}`
  },
  formWrapper: {
    // padding: theme.spacing(5, 2)
  },
  loginFooter: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'flex-end'
  },
  progressRight: {
    float: 'right'
  }
}));

const LoginContent: React.FC<LoginContentProps> = (
  props: LoginContentProps
) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item sm={9} md={5} lg={3}>
          <Paper className={clsx('paper', classes.loginContentContainer)}>
            <Typography variant="h5" className={classes.loginTitle}>
              Login
            </Typography>
            <Box className={classes.formWrapper}>
              <AccountValidationForm
                handleValidate={(details: IAccount) =>
                  props.handleValidate(details)
                }
                styles={classes}
                isSubmitting={props.isSubmitting}
                account={props.account}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default observer(LoginContent);
