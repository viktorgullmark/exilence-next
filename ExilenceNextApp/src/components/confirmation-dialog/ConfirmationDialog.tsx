import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import { observer } from 'mobx-react';
import RequestButton from '../request-button/RequestButton';

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

const useStyles = makeStyles((theme: Theme) => ({
  dialogActions: {
    padding: theme.spacing(2)
  }
}));

const ConfirmationDialog: React.FC<Props> = props => {
  const { show, onClose, onConfirm, title, body, acceptButtonText, cancelButtonText, loading } = props;
  const classes = useStyles();

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{body}</DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose}>
          {cancelButtonText}
        </Button>
        <RequestButton onClick={onConfirm} color="primary" variant="contained" disabled={loading} loading={!!loading}>
          {acceptButtonText}
        </RequestButton>
      </DialogActions>
    </Dialog>
  );
};

export default observer(ConfirmationDialog);
