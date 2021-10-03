import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './CustomPriceDialog.styles';
import * as Yup from 'yup';
import { Formik } from 'formik';
import SimpleField from '../simple-field/SimpleField';

type CustomPriceDialogProps = {
  show: boolean;
  initialValues: CustomPriceForm;
  onClose: () => void;
  onSubmit: (form: CustomPriceForm) => void;
};

export type CustomPriceForm = {
  price: number;
};

const CustomPriceDialog = ({ show, initialValues, onClose, onSubmit }: CustomPriceDialogProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const validationSchema = Yup.object<CustomPriceForm>().shape({
    price: Yup.number().required(t('label.required')),
  });

  return (
    <Dialog open={show} onClose={onClose}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => onSubmit(values)}
        validationSchema={validationSchema}
      >
        {({ isValid, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <DialogTitle>{t('title.custom_price_dialog_title')}</DialogTitle>
            <DialogContent>
              <SimpleField
                name="price"
                type="text"
                label={t('label.custom_price')}
                placeholder={t('label.custom_price_placeholder')}
                required
                autoFocus
              />
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
              <Button onClick={onClose} color="primary" variant="contained">
                {t('action.close')}
              </Button>
              <Button type="submit" disabled={!isValid} color="primary" variant="contained">
                {t('action.save_custom_price')}
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CustomPriceDialog;
