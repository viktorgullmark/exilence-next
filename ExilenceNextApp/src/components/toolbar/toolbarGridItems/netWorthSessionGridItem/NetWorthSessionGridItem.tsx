import React from 'react';
import { Grid, IconButton, Tooltip } from '@mui/material';
import useStyles from './NetWorthSessionGridItem.styles';
import { useTranslation } from 'react-i18next';
import PlayIcon from '@mui/icons-material/PlayCircleFilled';
import PauseIcon from '@mui/icons-material/PauseCircleFilled';
import StopIcon from '@mui/icons-material/StopCircle';
import CachedIcon from '@mui/icons-material/Cached';
import { Profile } from '../../../../store/domains/profile';

type NetWorthSessionGridItemProps = {
  sessionStarted: boolean;
  sessionPaused: boolean;
  signalrOnline: boolean;
  isSnapshotting: boolean;
  activeProfile?: Profile;
  isInitiating: boolean;
  profilesLoaded: boolean;
  toggleSessionNetWorth: () => void;
  handleSessionStart: () => void;
  handleSessionPause: () => void;
  handleSessionStop: () => void;
};

const NetWorthSessionGridItem = ({
  sessionStarted,
  sessionPaused,
  signalrOnline,
  isSnapshotting,
  activeProfile,
  isInitiating,
  profilesLoaded,
  toggleSessionNetWorth,
  handleSessionStart,
  handleSessionPause,
  handleSessionStop,
}: NetWorthSessionGridItemProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const isStartDisabled =
    (sessionStarted && !sessionPaused) || // Enable for start and continue
    (!sessionStarted && isSnapshotting) || // Enable for continue and started
    !activeProfile ||
    isInitiating ||
    !profilesLoaded;

  const isPauseDisabled =
    !sessionStarted ||
    (sessionStarted && sessionPaused) || // Diabled if - started and paused
    (!sessionStarted && isSnapshotting) ||
    !activeProfile ||
    isInitiating ||
    !profilesLoaded;

  const isStopDisabled =
    !sessionStarted ||
    isSnapshotting ||
    !activeProfile ||
    isInitiating ||
    !profilesLoaded ||
    !signalrOnline;

  return (
    <>
      <Grid item className={classes.sessionArea} data-tour-elem="networthSessionArea">
        {(!sessionStarted || (sessionStarted && sessionPaused)) && (
          <Tooltip
            title={
              (!sessionStarted
                ? t('label.start_net_worth_session_icon_title')
                : t('label.continue_net_worth_session_icon_title')) || ''
            }
            placement="bottom"
          >
            <span>
              <IconButton
                disabled={isStartDisabled}
                aria-label="start"
                className={classes.iconButton}
                onClick={() => handleSessionStart()}
                size="large"
              >
                <PlayIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {sessionStarted && !sessionPaused && (
          <Tooltip title={t('label.pause_net_worth_session_icon_title') || ''} placement="bottom">
            <span>
              <IconButton
                disabled={isPauseDisabled}
                aria-label="pause"
                className={classes.iconButton}
                onClick={() => handleSessionPause()}
                size="large"
              >
                <PauseIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        <Tooltip title={t('label.stop_net_worth_session_icon_title') || ''} placement="bottom">
          <span>
            <IconButton
              disabled={isStopDisabled}
              aria-label="stop"
              className={classes.iconButton}
              onClick={() => handleSessionStop()}
              size="large"
            >
              <StopIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={t('label.toggle_net_worth_session_icon_title') || ''} placement="bottom">
          <span>
            <IconButton
              disabled={!sessionStarted}
              aria-label="toggle session networth"
              className={classes.iconButton}
              onClick={() => toggleSessionNetWorth()}
              size="large"
            >
              <CachedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Grid>
    </>
  );
};

export default NetWorthSessionGridItem;
