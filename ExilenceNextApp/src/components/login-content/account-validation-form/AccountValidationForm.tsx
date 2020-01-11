import {
  Button,
  CircularProgress,
  TextField,
  makeStyles,
  Theme,
  Box,
  IconButton,
  Typography,
  Link,
  Grid
} from '@material-ui/core';
import { Formik } from 'formik';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { Account } from '../../../store/domains/account';
import { IAccount } from '../../../interfaces/account.interface';
import HelpIcon from '@material-ui/icons/Help';
import { WindowUtils } from '../../../utils/window.utils';
import ConsentDialog from '../../consent-dialog/ConsentDialog';

interface AccountValidationFormProps {
  handleValidate: (account: IAccount) => void;
  styles: Record<string, string>;
  isSubmitting: boolean;
  account: Account;
}

interface AccountFormValues {
  sessionId: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  wrapper: {
    position: 'relative',
    width: '100%'
  },
  helperIcon: {
    color: theme.palette.primary.light,
    marginRight: theme.spacing(-0.5)
  },
  inlineLink: {
    color: theme.palette.primary.light,
    verticalAlign: 'baseline'
  }
}));

const AccountValidationForm: React.FC<AccountValidationFormProps> = (
  props: AccountValidationFormProps
) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [showConsent, setShowConsent] = useState(false);

  return (
    <>
      <Formik
        initialValues={{
          sessionId: props.account.sessionId
        }}
        onSubmit={(values: AccountFormValues) => {
          props.handleValidate({
            sessionId: values.sessionId
          });
        }}
        validationSchema={Yup.object().shape({
          sessionId: Yup.string().required('Required')
        })}
      >
        {/* todo: refactor and use new formik */}
        {(formProps: any) => {
          const {
            values,
            touched,
            errors,
            dirty,
            handleChange,
            handleBlur,
            handleSubmit,
            isValid
          } = formProps;
          return (
            <form onSubmit={handleSubmit}>
              <div>
                <TextField
                  label={t('label.session_id')}
                  name="sessionId"
                  type="password"
                  variant="outlined"
                  value={values.sessionId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={
                    errors.sessionId && touched.sessionId && errors.sessionId
                  }
                  error={touched.sessionId && errors.sessionId !== undefined}
                  margin="normal"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="help"
                        title={t('label.session_id_icon_title')}
                        className={classes.helperIcon}
                        edge="start"
                        size="small"
                        onClick={e => WindowUtils.openLink(e)}
                        href="https://code.google.com/archive/p/procurement/wikis/LoginWithSessionID.wiki"
                      >
                        <HelpIcon />
                      </IconButton>
                    )
                  }}
                ></TextField>
              </div>
              <div className={props.styles.loginFooter}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">
                      {t('body.ga_consent_short_text')}
                      <Link
                        component="button"
                        variant="subtitle2"
                        type="button"
                        className={classes.inlineLink}
                        onClick={() => setShowConsent(true)}
                      >
                        {t('label.these_terms_inline')}
                      </Link>
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <div className={classes.wrapper}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        disabled={
                          !touched || props.isSubmitting || (dirty && !isValid)
                        }
                        endIcon={<ExitToApp />}
                      >
                        {t('action.authorize')}
                      </Button>
                      {props.isSubmitting && (
                        <CircularProgress
                          className={classes.buttonProgress}
                          size={26}
                        />
                      )}
                    </div>
                  </Grid>
                </Grid>
              </div>
            </form>
          );
        }}
      </Formik>
      <ConsentDialog show={showConsent} onClose={() => setShowConsent(false)} />
    </>
  );
};

export default observer(AccountValidationForm);
