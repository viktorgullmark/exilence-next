import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../../..';

const ResetIndexedDbSettings = () => {
  const { signalrStore, migrationStore } = useStores();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const { t } = useTranslation();

  const handleDataResetConfirmation = async () => {
    setIsClearing(true);

    migrationStore!.clearStorage().subscribe(() => {
      signalrStore!.signOut();
      setIsClearing(false);
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
            Reset Data
          </Button>
          <p>This option will reset your account, league and local settings.</p>
          <p>You will be signed out once data is cleared.</p>
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
