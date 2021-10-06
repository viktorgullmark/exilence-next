import ExitToApp from '@mui/icons-material/ExitToApp';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, Link, Typography } from '@mui/material';
import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useStores } from '../../..';
import { ISelectOption } from '../../../interfaces/select-option.interface';
import { Account } from '../../../store/domains/account';
import ConsentDialog from '../../consent-dialog/ConsentDialog';
import SelectField from '../../select-field/SelectField';
import useStyles from './AccountValidationForm.styles';
export type AccountFormValues = {
  platform: string;
};

type AccountValidationFormProps = {
  handleValidate: (form: AccountFormValues) => void;
  styles: Record<string, string>;
  isSubmitting: boolean;
  isInitiating: boolean;
  account: Account;
};

const AccountValidationForm = ({
  handleValidate,
  styles,
  isSubmitting,
  isInitiating,
}: AccountValidationFormProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { uiStateStore } = useStores();
  const [showConsent, setShowConsent] = useState(false);

  return (
    <>
      <Formik
        initialValues={{
          platform: uiStateStore.selectedPlatform.id,
        }}
        onSubmit={(values: AccountFormValues) => {
          handleValidate(values);
        }}
        validationSchema={Yup.object().shape({
          platform: Yup.string().required('Required'),
        })}
      >
        {/* todo: refactor and use new formik */}
        {(formProps: any) => {
          const { touched, dirty, handleSubmit, isValid } = formProps;
          return (
            <form onSubmit={handleSubmit}>
              <div>
                <SelectField
                  name="platform"
                  label={t('label.select_platform')}
                  options={uiStateStore.platformList.map((p) => {
                    return {
                      id: p.id,
                      value: p.value,
                      label: p.label,
                    } as ISelectOption;
                  })}
                />
              </div>
              <div className={styles.loginFooter}>
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
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      type="submit"
                      loadingPosition="end"
                      loading={isSubmitting || isInitiating}
                      disabled={!touched || (dirty && !isValid)}
                      endIcon={<ExitToApp />}
                    >
                      {t('action.authorize')}
                    </LoadingButton>
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
