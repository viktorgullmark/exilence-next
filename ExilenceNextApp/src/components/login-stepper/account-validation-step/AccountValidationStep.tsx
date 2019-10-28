import { Button, CircularProgress, TextField } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { Account } from '../../../store/domains/account';

interface AccountValidationStepProps {
  handleValidate: Function;
  handleBack: Function;
  activeStep: number;
  styles: Record<string, string>;
  isSubmitting: boolean;
  account: Account;
}

interface AccountFormValues {
  accountName: string;
  sessionId: string;
}

const AccountValidationStep: React.FC<AccountValidationStepProps> = (
  props: AccountValidationStepProps
) => {
  const { t } = useTranslation();

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
          handleChange,
          handleBlur,
          handleSubmit
        } = formProps;
        return (
          <form onSubmit={handleSubmit}>
            <div className={props.styles.stepMainContent}>
              <TextField
                label={t('label.account_name')}
                name="accountName"
                value={values.accountName}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  errors.accountName &&
                  touched.accountName &&
                  errors.accountName
                }
                error={touched.accountName && errors.accountName !== undefined}
                margin="normal"
                fullWidth
              />
              <TextField
                label={t('label.session_id')}
                name="sessionId"
                type="password"
                value={values.sessionId}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={
                  errors.sessionId && touched.sessionId && errors.sessionId
                }
                error={touched.sessionId && errors.sessionId !== undefined}
                margin="normal"
                fullWidth
              />
            </div>
            <div className={props.styles.stepFooter}>
              <Button
                disabled={props.activeStep === 0 || props.isSubmitting}
                onClick={() => props.handleBack()}
              >
                {t('action.back')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={props.isSubmitting}
              >
                {t('action.next')}
              </Button>
              {props.isSubmitting && <CircularProgress className={props.styles.progressRight} size={36} />}
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default observer(AccountValidationStep);
