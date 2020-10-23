import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, IconButton, Link, TextField, Typography } from '@material-ui/core';
import ExitToApp from '@material-ui/icons/ExitToApp';
import HelpIcon from '@material-ui/icons/Help';
import { Formik } from 'formik';
import { observer } from 'mobx-react';
import * as Yup from 'yup';

import { IAccount } from '../../../interfaces/account.interface';
import { Account } from '../../../store/domains/account';
import { openLink } from '../../../utils/window.utils';
import ConsentDialog from '../../consent-dialog/ConsentDialog';
import InfoDialog from '../../info-dialog/InfoDialog';
import RequestButton from '../../request-button/RequestButton';
import useStyles from './AccountValidationForm.styles';

type AccountFormValues = {
  sessionId: string;
};

type AccountValidationFormProps = {
  handleValidate: (account: IAccount) => void;
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
  account,
}: AccountValidationFormProps) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [showConsent, setShowConsent] = useState(false);
  const [showSessionIdInfo, setShowSessionIdInfo] = useState(false);

  return (
    <>
      <Formik
        initialValues={{
          sessionId: account.sessionId,
        }}
        onSubmit={(values: AccountFormValues) => {
          handleValidate({
            sessionId: values.sessionId,
          });
        }}
        validationSchema={Yup.object().shape({
          sessionId: Yup.string().required('Required'),
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
            isValid,
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
                  helperText={errors.sessionId && touched.sessionId && errors.sessionId}
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
                        onClick={() => setShowSessionIdInfo(true)}
                      >
                        <HelpIcon />
                      </IconButton>
                    ),
                  }}
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
                    <RequestButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      type="submit"
                      loading={isSubmitting || isInitiating}
                      disabled={!touched || isSubmitting || isInitiating || (dirty && !isValid)}
                      endIcon={<ExitToApp />}
                    >
                      {t('action.authorize')}
                    </RequestButton>
                  </Grid>
                </Grid>
              </div>
            </form>
          );
        }}
      </Formik>
      <ConsentDialog show={showConsent} onClose={() => setShowConsent(false)} />
      <InfoDialog
        show={showSessionIdInfo}
        onClose={() => setShowSessionIdInfo(false)}
        title={t('title.session_id_dialog')}
        content={
          <>
            <Box width={1} mb={2}>
              <Typography variant="body2">
                {t('body.session_id_dialog_prefix')}&nbsp;
                <a
                  className={classes.inlineLink}
                  href="https://www.pathofexile.com"
                  onClick={(e) => openLink(e)}
                >
                  https://www.pathofexile.com
                </a>
                &nbsp;
                {t('body.session_id_dialog_suffix')}
              </Typography>
            </Box>
            <Box width={1} mb={2} className={classes.linkBlock}>
              <Typography variant="subtitle2">{t('label.google_chrome')}</Typography>
              <a
                className={classes.inlineLink}
                href="https://developers.google.com/web/tools/chrome-devtools/storage/cookies"
                onClick={(e) => openLink(e)}
              >
                https://developers.google.com/web/tools/chrome-devtools/storage/cookies
              </a>
            </Box>
            <Box width={1} mb={2} className={classes.linkBlock}>
              <Typography variant="subtitle2">{t('label.mozilla_firefox')}</Typography>
              <a
                className={classes.inlineLink}
                href="https://developer.mozilla.org/en-US/docs/Tools/Storage_Inspector"
                onClick={(e) => openLink(e)}
              >
                https://developer.mozilla.org/en-US/docs/Tools/Storage_Inspector
              </a>
            </Box>
            <Box width={1} mb={2} className={classes.linkBlock}>
              <Typography variant="subtitle2">{t('label.microsoft_edge')}</Typography>
              <a
                className={classes.inlineLink}
                href="https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/storage/cookies"
                onClick={(e) => openLink(e)}
              >
                https://docs.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/storage/cookies
              </a>
            </Box>
          </>
        }
      />
    </>
  );
};

export default observer(AccountValidationForm);
