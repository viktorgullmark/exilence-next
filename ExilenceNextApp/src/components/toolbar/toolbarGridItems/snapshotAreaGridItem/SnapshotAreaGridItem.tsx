import React from 'react';
import { Button, Grid, IconButton, Tooltip } from '@mui/material';
import useStyles from './SnapshotAreaGridItem.styles';
import { useTranslation } from 'react-i18next';
import { Profile } from '../../../../store/domains/profile';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import UpdateIcon from '@mui/icons-material/Update';
import { Cancel } from '@mui/icons-material';

type SnapshotAreaGridItemProps = {
  signalrOnline: boolean;
  isSnapshotting: boolean;
  activeProfile?: Profile;
  retryAfter: number;
  handleSnapshot: () => void;
  handleClearSnapshots: () => void;
  handleCancelSnapshot: () => void;
};

const SnapshotAreaGridItem = ({
  signalrOnline,
  isSnapshotting,
  activeProfile,
  retryAfter,
  handleSnapshot,
  handleClearSnapshots,
  handleCancelSnapshot,
}: SnapshotAreaGridItemProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid item className={classes.snapshotArea} data-tour-elem="snapshotArea">
      <Button
        startIcon={<UpdateIcon />}
        variant="contained"
        size="small"
        color="primary"
        disabled={
          !activeProfile || !activeProfile.readyToSnapshot || !signalrOnline || retryAfter > 0
        }
        onClick={() => handleSnapshot()}
        aria-label="snapshot"
        className={classes.snapshotBtn}
      >
        {t('label.fetch_snapshot_icon_title')}
      </Button>
      <Tooltip title={t('label.cancel_snapshot_icon_title') || ''} placement="bottom">
        <span>
          <IconButton
            disabled={!isSnapshotting}
            onClick={() => handleCancelSnapshot()}
            aria-label="cancelSnapshot"
            className={classes.iconButton}
            size="large"
          >
            <Cancel fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={t('label.remove_snapshot_icon_title') || ''} placement="bottom">
        <span>
          <IconButton
            disabled={
              !activeProfile ||
              isSnapshotting ||
              !signalrOnline ||
              (activeProfile.snapshots.length === 0 && activeProfile.session.snapshots.length === 0)
            }
            onClick={() => handleClearSnapshots()}
            aria-label="clear snapshots"
            className={classes.iconButton}
            size="large"
          >
            <DeleteSweepIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Grid>
  );
};

export default SnapshotAreaGridItem;
