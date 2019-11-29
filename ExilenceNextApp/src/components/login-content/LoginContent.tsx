import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IAccount } from '../../interfaces/account.interface';
import { Account } from '../../store/domains/account';
import AccountValidationForm from './account-validation-form/AccountValidationForm';

interface LoginContentProps {
  handleValidate: (account: IAccount) => void;
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
    textAlign: 'center',
    marginBottom: theme.spacing(5),
    textTransform: 'uppercase',
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.primary.main}`
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
        <Grid item sm={9} md={5} lg={4} xl={3}>
          <Paper className={clsx('paper', classes.loginContentContainer)}>
            <Typography variant="h5" className={classes.loginTitle}>
              {t('title.login')}
            </Typography>
            <Box>
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
