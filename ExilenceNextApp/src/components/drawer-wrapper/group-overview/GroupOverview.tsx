import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Typography
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { observer } from 'mobx-react';
import React, { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Group } from '../../../store/domains/group';
import PlayerListContainer from '../../player-list/PlayerListContainer';
import RequestButton from '../../request-button/RequestButton';
import useStyles from './GroupOverview.styles';

type Handler = (event: MouseEvent<HTMLElement>) => void

type GroupOverviewProps = {
  open: boolean;
  leavingGroup: boolean;
  toggleGroupOverview: () => void;
  handleJoinGroup: Handler;
  handleCreateGroup: Handler;
  handleLeaveGroup: Handler;
  activeGroup?: Group;
}

const GroupOverview = ({
  open,
  leavingGroup,
  toggleGroupOverview,
  handleJoinGroup,
  handleCreateGroup,
  handleLeaveGroup,
  activeGroup
}: GroupOverviewProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="right"
      color="secondary"
      open={open}
      transitionDuration={0}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={() => toggleGroupOverview()}>
          {theme.direction !== 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <Box p={2}>
        <Grid container spacing={2}>
          {activeGroup ? (
            <>
              <Grid item xs={12}>
                <Typography component="h4" className={classes.groupName}>
                  {activeGroup.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <RequestButton
                  variant="contained"
                  color="primary"
                  disabled={leavingGroup}
                  loading={leavingGroup}
                  fullWidth
                  onClick={handleLeaveGroup}
                >
                  {t('action.leave_group')}
                </RequestButton>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCreateGroup}
                >
                  {t('action.create_group')}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleJoinGroup}
                >
                  {t('action.join_group')}
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
      <Box>
        <PlayerListContainer />
      </Box>
    </Drawer>
  );
};

export default observer(GroupOverview);
