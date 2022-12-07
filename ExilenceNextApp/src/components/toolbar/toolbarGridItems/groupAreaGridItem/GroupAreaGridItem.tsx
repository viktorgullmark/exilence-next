import React from 'react';
import { Grid, IconButton, Tooltip } from '@mui/material';
import useStyles from './GroupAreaGridItem.styles';
import { useTranslation } from 'react-i18next';
import GroupIcon from '@mui/icons-material/Group';

type GroupAreaGridItemProps = {
  signalrOnline: boolean;
  isSnapshotting: boolean;
  toggleGroupOverview: () => void;
};

const GroupAreaGridItem = ({
  signalrOnline,
  isSnapshotting,
  toggleGroupOverview,
}: GroupAreaGridItemProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid item className={classes.groupArea} data-tour-elem="groupArea">
      <Tooltip title={t('label.group_icon_title') || ''} placement="bottom">
        <span>
          <IconButton
            disabled={isSnapshotting || !signalrOnline}
            onClick={() => toggleGroupOverview()}
            aria-label="group"
            aria-haspopup="true"
            className={classes.iconButton}
            size="large"
          >
            <GroupIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Grid>
  );
};

export default GroupAreaGridItem;
