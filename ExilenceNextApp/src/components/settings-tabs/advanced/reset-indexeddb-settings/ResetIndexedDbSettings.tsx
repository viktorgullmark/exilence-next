import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  Grid,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../../..';
import { restart } from '../../../../utils/window.utils';

const ResetIndexedDbSettings = () => {
  const { signalrStore, migrationStore, uiStateStore } = useStores();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { t } = useTranslation();

  const handleDataResetConfirmation = async () => {
    setIsClearing(true);
    uiStateStore.setCancelSnapshot(true);
    migrationStore!.clearStorage().subscribe(() => {
      signalrStore!.signOut();
      setIsClearing(false);
      restart();
    });
  };

  const handleConfirmationDialogToggle = () => setIsDialogOpen((isOpen) => !isOpen);

  return (
    <>
      <Grid container spacing={5}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleConfirmationDialogToggle}
          >
            {t('title.reset_indexeddb')}
          </Button>
          <Box mt={2}>
            <FormHelperText>{t('helper_text.reset_indexeddb')}</FormHelperText>
          </Box>
        </Grid>
      </Grid>
      <Dialog open={isDialogOpen} onClose={handleConfirmationDialogToggle}>
        <DialogTitle>{t('body.reset_indexeddb')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('body.reset_indexeddb_notice')} {t('body.reset_indexeddb_signout')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmationDialogToggle} autoFocus>
            {t('action.cancel')}
          </Button>
          <Button
            onClick={handleDataResetConfirmation}
            color="primary"
            variant="contained"
            disabled={isClearing}
          >
            {t('action.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default observer(ResetIndexedDbSettings);
