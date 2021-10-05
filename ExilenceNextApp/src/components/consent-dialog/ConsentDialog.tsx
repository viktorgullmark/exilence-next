import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import useStyles from './ConsentDialog.styles';

type ConsentDialogProps = {
  show: boolean;
  onClose: () => void;
};

const ConsentDialog = ({ show, onClose }: ConsentDialogProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Dialog open={show} onClose={onClose}>
      <DialogTitle>{t('title.ga_consent_dialog_title')}</DialogTitle>
      <DialogContent>
        <Box width={1} mb={1}>
          <Typography variant="body2">{t('body.ga_consent_main_text')}</Typography>
        </Box>
        <Box width={1} mb={2}>
          <Typography variant="body2">{t('body.ga_consent_sub_text')}</Typography>
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
