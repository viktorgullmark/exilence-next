import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Theme,
  IconButton
} from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { IGroupForm } from './GroupDialogContainer';
import * as Yup from 'yup';
import SimpleField from '../simple-field/SimpleField';
import CasinoIcon from '@material-ui/icons/CasinoRounded';
import PasswordField from '../password-field/PasswordField';
import { generateGroupName } from '../../utils/group.utils';
import { observer } from 'mobx-react';

const useStyles = makeStyles((theme: Theme) => ({
  dialogActions: {
    padding: theme.spacing(2)
  },
  consent: {
    color: theme.palette.text.hint
  },
  formField: {
    marginBottom: theme.spacing(2)
  },
  helperIcon: {}
}));

interface Props {
  show: boolean;
  initialValues: IGroupForm;
  dialogType: 'create' | 'join' | undefined;
  onClose: () => void;
  onSubmit: (group: IGroupForm) => void;
  handleGroupExists: (groupName: string) => void;
  groupExists?: boolean;
}

const GroupDialog: React.FC<Props> = ({
  show,
  onClose,
  onSubmit,
  initialValues,
  groupExists,
  dialogType,
  handleGroupExists
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const validationSchema = Yup.object<IGroupForm>().shape({
    name: Yup.string().required(t('label.required')),
    password: Yup.string().min(6)
  });

  const getGroupExistsError = () => {
    switch (dialogType) {
      case 'create':
        return groupExists !== undefined && groupExists
          ? t('error:group_already_exists')
          : undefined;
      case 'join':
        return groupExists !== undefined && !groupExists
          ? t('error:group_not_found')
          : undefined;
      default:
        return undefined;
    }
  };

  return (
    <Dialog open={show} onClose={onClose}>
      <Formik
        initialValues={initialValues}
        onSubmit={values => onSubmit(values)}
        validationSchema={validationSchema}
      >
        {({ isValid, dirty, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {t(`title.${dialogType}_group_dialog_title`)}
            </DialogTitle>
            <DialogContent>
              <SimpleField
                name="name"
                type="text"
                label={t('label.group_name')}
                placeholder={t('label.group_name_placeholder')}
                endIcon={
                  dialogType === 'create' ? (
                    <IconButton
                      aria-label="generate"
                      title={t('label.generate_name_icon_title')}
                      className={classes.helperIcon}
                      edge="start"
                      size="small"
                      onClick={() => {
                        const name = generateGroupName();
                        setFieldValue('name', name);
                        handleGroupExists(name);
                      }}
                    >
                      <CasinoIcon />
                    </IconButton>
                  ) : (
                    undefined
                  )
                }
                customError={getGroupExistsError()}
                handleBlur={handleGroupExists}
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
                disabled={!isValid || getGroupExistsError() !== undefined}
                color="primary"
                variant="contained"
              >
                {t(`action.${dialogType}_group`)}
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default observer(GroupDialog);
