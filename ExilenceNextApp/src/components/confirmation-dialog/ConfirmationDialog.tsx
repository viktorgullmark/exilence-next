import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import { observer } from 'mobx-react';
import React from 'react';
import RequestButton from '../request-button/RequestButton';
import useStyles from './ConfirmationDialog.styles';

interface Props {
  show: boolean;
  title: string;
  body: string;
  acceptButtonText: string;
  cancelButtonText: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

const ConfirmationDialog: React.FC<Props> = props => {
  const {
    show,
    onClose,
    onConfirm,
    title,
    body,
    acceptButtonText,
    cancelButtonText,
    loading
  } = props;
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
