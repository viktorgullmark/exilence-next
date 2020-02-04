import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './ConsentDialog.styles';

interface Props {
  show: boolean;
  onClose: () => void;
}

const ConsentDialog: React.FC<Props> = ({ show, onClose }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>{t('title.ga_consent_dialog_title')}</DialogTitle>
      <DialogContent>
        <Box width={1} mb={1}>
          <Typography className={classes.consent} variant="subtitle2">
            {t('body.ga_consent_main_text')}
          </Typography>
        </Box>
        <Box width={1} mb={2}>
          <Typography className={classes.consent} variant="subtitle2">
            {t('body.ga_consent_sub_text')}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={onClose} color="primary" variant="contained">
          {t('action.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsentDialog;
