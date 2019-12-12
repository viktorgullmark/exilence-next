import {
  Button,
  CircularProgress,
  TextField,
  makeStyles,
  Theme,
  Box,
  IconButton
} from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { Account } from '../../../store/domains/account';
import { IAccount } from '../../../interfaces/account.interface';
import HelpIcon from '@material-ui/icons/Help';
import { WindowUtils } from '../../../utils/window.utils';

interface AccountValidationFormProps {
  handleValidate: (account: IAccount) => void;
  styles: Record<string, string>;
  isSubmitting: boolean;
  account: Account;
}

interface AccountFormValues {
  accountName: string;
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
  }
}));

const AccountValidationForm: React.FC<AccountValidationFormProps> = (
  props: AccountValidationFormProps
) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Formik
      initialValues={{
        accountName: props.account.name,
        sessionId: props.account.sessionId
      }}
      onSubmit={(
        values: AccountFormValues,
        { setSubmitting }: FormikActions<AccountFormValues>
      ) => {
        props.handleValidate({
          name: values.accountName,
          sessionId: values.sessionId
        });
      }}
      validationSchema={Yup.object().shape({
        accountName: Yup.string().required('Required'),
        sessionId: Yup.string().required('Required')
      })}
    >
      {formProps => {
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
                label={t('label.account_name')}
                name="accountName"
                value={values.accountName}
                onChange={handleChange}
                onBlur={handleBlur}
                variant="outlined"
                helperText={
                  errors.accountName &&
                  touched.accountName &&
                  errors.accountName
                }
                error={touched.accountName && errors.accountName !== undefined}
                margin="none"
                fullWidth
              />
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
              <div className={classes.wrapper}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                  disabled={!touched || (props.isSubmitting || (dirty && !isValid))}
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
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default observer(AccountValidationForm);
