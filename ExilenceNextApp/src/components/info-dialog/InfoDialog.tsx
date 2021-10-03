import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import useStyles from './InfoDialog.styles';

type InfoDialogProps = {
  show: boolean;
  title: string;
  content: JSX.Element;
  onClose: () => void;
};

const InfoDialog = ({ show, title, content, onClose }: InfoDialogProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose} color="primary" variant="contained">
          {t('action.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;
