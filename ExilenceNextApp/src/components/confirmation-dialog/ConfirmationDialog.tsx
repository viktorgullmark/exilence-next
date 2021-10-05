import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { observer } from 'mobx-react-lite';

import RequestButton from '../request-button/RequestButton';
import useStyles from './ConfirmationDialog.styles';

type ConfirmationDialogProps = {
  show: boolean;
  title: string;
  body: string;
  acceptButtonText: string;
  cancelButtonText: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

const ConfirmationDialog = ({
  show,
  onClose,
  onConfirm,
  title,
  body,
  acceptButtonText,
  cancelButtonText,
  loading,
}: ConfirmationDialogProps) => {
  const classes = useStyles();

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose}>{cancelButtonText}</Button>
        <RequestButton
          onClick={onConfirm}
          color="primary"
          variant="contained"
          disabled={loading}
          loading={!!loading}
        >
          {acceptButtonText}
        </RequestButton>
      </DialogActions>
    </Dialog>
  );
};

export default observer(ConfirmationDialog);
