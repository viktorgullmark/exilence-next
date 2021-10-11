import LoadingButton from '@mui/lab/LoadingButton';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import useStyles from './ConfirmationDialog.styles';
import SaveIcon from '@mui/icons-material/Save';

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
        <LoadingButton
          onClick={onConfirm}
          color="primary"
          variant="contained"
          loading={!!loading}
          loadingPosition="end"
          endIcon={<SaveIcon />}
        >
          {acceptButtonText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default observer(ConfirmationDialog);
