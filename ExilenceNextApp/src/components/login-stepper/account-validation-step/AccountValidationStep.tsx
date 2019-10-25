import { TextField, makeStyles, Button, LinearProgress } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { AccountStore } from '../../../store/accountStore';
import { UiStateStore } from './../../../store/uiStateStore';

interface AccountValidationStepProps {
  accountStore?: AccountStore;
  uiStateStore?: UiStateStore;
  handleValidate: Function;
  handleBack: Function;
  activeStep: number;
  styles: Record<string, string>;
}

interface AccountFormValues {
  accountName: string;
  sessionId: string;
}

const AccountValidationStep: React.FC<AccountValidationStepProps> = (
  props: AccountValidationStepProps
) => {
  const { t } = useTranslation();
  const { isSubmitting } = props.uiStateStore!.loginStepper;
  const account = props.accountStore!.getSelectedAccount;

  return (
    <Formik
      initialValues={{ accountName: account.name, sessionId: account.sessionId }}
      onSubmit={(values: AccountFormValues, { setSubmitting }: FormikActions<AccountFormValues>) => {
        props.handleValidate({ name: values.accountName, sessionId: values.sessionId });
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
                error={touched.accountName && errors.accountName != undefined}
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
                error={touched.sessionId && errors.sessionId != undefined}
                margin="normal"
                fullWidth
              />
            </div>
            {isSubmitting && <LinearProgress />}
            <div className={props.styles.stepFooter}>
              <Button
                disabled={props.activeStep === 0 || isSubmitting}
                onClick={() => props.handleBack()}
              >
                {t('action.back')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit" 
                disabled={isSubmitting}
              >
                {t('action.next')}
              </Button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default inject('accountStore', 'uiStateStore')(observer(AccountValidationStep));
