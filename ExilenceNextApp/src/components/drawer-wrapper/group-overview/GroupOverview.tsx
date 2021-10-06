import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Divider, Drawer, Grid, IconButton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import React, { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Group } from '../../../store/domains/group';
import PlayerListContainer from '../../player-list/PlayerListContainer';
import useStyles from './GroupOverview.styles';
import SaveIcon from '@mui/icons-material/Save';

type Handler = (event: MouseEvent<HTMLElement>) => void;

type GroupOverviewProps = {
  open: boolean;
  leavingGroup: boolean;
  toggleGroupOverview: () => void;
  handleJoinGroup: Handler;
  handleCreateGroup: Handler;
  handleLeaveGroup: Handler;
  activeGroup?: Group;
};

const GroupOverview = ({
  open,
  leavingGroup,
  toggleGroupOverview,
  handleJoinGroup,
  handleCreateGroup,
  handleLeaveGroup,
  activeGroup,
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
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={() => toggleGroupOverview()} size="large">
          {theme.direction !== 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
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
                <LoadingButton
                  variant="contained"
                  color="primary"
                  loadingPosition="end"
                  loading={leavingGroup}
                  fullWidth
                  endIcon={<SaveIcon />}
                  onClick={handleLeaveGroup}
                >
                  {t('action.leave_group')}
                </LoadingButton>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" fullWidth onClick={handleCreateGroup}>
                  {t('action.create_group')}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" fullWidth onClick={handleJoinGroup}>
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
