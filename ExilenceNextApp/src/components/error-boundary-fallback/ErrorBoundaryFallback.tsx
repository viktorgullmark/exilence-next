import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../..';
import { restart } from '../../utils/window.utils';
import useStyles from './ErrorBoundaryFallback.styles';

type ErrorBoundaryFallbackProps = {
  error: Error;
  componentStack: string | null;
};

const ErrorBoundaryFallback = ({ error, componentStack }: ErrorBoundaryFallbackProps) => {
  const { migrationStore } = useStores();

  const classes = useStyles();
  const { t } = useTranslation();
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAndRestart = async () => {
    setIsClearing(true);

    migrationStore!.clearStorage().subscribe(() => {
      setIsClearing(false);
      restart();
    });
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      className={classes.content}
    >
      <Grid item md={9} lg={7} xl={5}>
        <Paper className={clsx('paper', classes.contentContainer)}>
          <Typography color="error" variant="h5">
            {t('title.error_boundary')}
          </Typography>
          <Box mt={2}>
            <div>{error.toString()}</div>
            <div>{componentStack}</div>
          </Box>
          <Box mt={2}>
            <Grid container justifyContent="flex-end" spacing={2}>
              <Grid item>
                <Button disabled={isClearing} onClick={handleClearAndRestart} variant="contained">
                  {t('action.clear_and_restart_application')}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => {
                    restart();
                  }}
                  variant="contained"
                  color="primary"
                >
                  {t('action.restart_application')}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default observer(ErrorBoundaryFallback);
