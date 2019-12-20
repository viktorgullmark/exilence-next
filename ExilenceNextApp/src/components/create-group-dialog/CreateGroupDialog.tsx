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

const useStyles = makeStyles((theme: Theme) => ({
  dialogActions: {
    padding: theme.spacing(2)
  },
  consent: {
    color: theme.palette.text.hint
  }
}));

interface Props {
  show: boolean;
  onClose: () => void;
  onCreate: () => void;
}

const CreateGroupDialog: React.FC<Props> = ({
  show,
  onClose,
  onCreate
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>{t('title.create_group_dialog_title')}</DialogTitle>
      <DialogContent>create-group-content</DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose}>{t('action.close')}</Button>
        <Button onClick={onCreate} color="primary" variant="contained">
          {t('action.create_group')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGroupDialog;
