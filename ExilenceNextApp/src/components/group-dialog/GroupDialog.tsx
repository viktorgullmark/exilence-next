import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Theme
} from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { IGroupForm } from './GroupDialogContainer';
import * as Yup from 'yup';
import SimpleField from '../simple-field/SimpleField';
import PasswordField from '../password-field/PasswordField';

const useStyles = makeStyles((theme: Theme) => ({
  dialogActions: {
    padding: theme.spacing(2)
  },
  consent: {
    color: theme.palette.text.hint
  },
  formField: {
    marginBottom: theme.spacing(2)
  }
}));

interface Props {
  show: boolean;
  initialValues: IGroupForm;
  onClose: () => void;
  onSubmit: (group: IGroupForm) => void;
}

const GroupDialog: React.FC<Props> = ({
  show,
  initialValues,
  onClose,
  onSubmit
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const validationSchema = Yup.object<IGroupForm>().shape({
    name: Yup.string().required(t('label.required')),
    password: Yup.string().min(6)
  });

  return (
    <Dialog open={show} onClose={onClose}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => onSubmit(values)}
        validationSchema={validationSchema}
      >
        {({ isValid, dirty, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <DialogTitle>{t('title.create_group_dialog_title')}</DialogTitle>
            <DialogContent>
              <SimpleField // todo: add translations
                name="name"
                type="text"
                label={t('label.group_name')}
                placeholder={t('label.group_name_placeholder')}
                required
                autoFocus
              />
              <PasswordField
                name="password"
                label={t('label.password')}
                placeholder={t('label.password_placeholder')}
                helperText={t('label.password_helper_text')}
              />
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
              <Button onClick={onClose}>{t('action.close')}</Button>
              <Button
                type="submit"
                disabled={!isValid || !dirty}
                color="primary"
                variant="contained"
              >
                {t('action.create_group')}
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default GroupDialog;
