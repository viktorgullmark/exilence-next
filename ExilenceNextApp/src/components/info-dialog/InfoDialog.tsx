import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './InfoDialog.styles';

interface Props {
  show: boolean;
  title: string;
  content: JSX.Element;
  onClose: () => void;
}

const InfoDialog: React.FC<Props> = ({ show, title, content, onClose }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose} color="primary" variant="contained">
          {t('action.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;
