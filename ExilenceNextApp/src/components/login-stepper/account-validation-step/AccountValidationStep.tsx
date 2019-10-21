import { TextField, makeStyles } from '@material-ui/core';
import { Formik } from 'formik';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { AccountStore } from '../../../store/accountStore';

interface AccountValidationStepProps {
  accountStore?: AccountStore;
}

const AccountValidationStep: React.FC<AccountValidationStepProps> = ({
  accountStore
}: AccountValidationStepProps) => {
  const { t } = useTranslation();
  const [submitComplete, setSubmitComplete] = useState(false);
  
  return (
    <Formik
      initialValues={{ accountName: '', sessionId: '' }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        setTimeout(() => {
          setSubmitComplete(true);
        }, 1500);
      }}
      validationSchema={Yup.object().shape({
        accountName: Yup.string().required('Required'),
        sessionId: Yup.string().required('Required')
      })}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset
        } = props;
        return (
          <form onSubmit={handleSubmit}>
            <TextField
              label={t('label.account_name')}
              name="accountName"
              value={values.accountName}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errors.accountName && touched.accountName && errors.accountName}
              margin="normal"
              fullWidth
            />
            <TextField
              label={t('label.session_id')}
              name="sessionId"
              value={values.sessionId}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errors.sessionId && touched.sessionId && errors.sessionId}
              margin="normal"
              fullWidth
            />
          </form>
        );
      }}
    </Formik>
  );
};

export default inject('accountStore')(observer(AccountValidationStep));
