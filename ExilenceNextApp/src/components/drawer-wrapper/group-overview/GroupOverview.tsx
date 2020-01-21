import {
  Divider,
  Drawer,
  IconButton,
  Grid,
  Button,
  Box,
  Typography
} from '@material-ui/core';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  resizeHandleContainerHeight,
  toolbarHeight
} from '../../header/Header';
import { drawerWidth } from '../DrawerWrapper';
import PlayerListContainer from '../../player-list/PlayerListContainer';
import { Group } from '../../../store/domains/group';
import RequestButton from '../../request-button/RequestButton';

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    height: `calc(100% - ${toolbarHeight}px)`,
    top: `calc(${toolbarHeight}px + ${resizeHandleContainerHeight}px)`,
    width: drawerWidth,
    background: theme.palette.background.default
  },
  drawerHeader: {
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-start'
  },
  groupName: {
    textAlign: 'center'
  }
}));

interface GroupOverviewProps {
  open: boolean;
  leavingGroup: boolean;
  toggleGroupOverview: () => void;
  handleJoinGroup: (event: React.MouseEvent<HTMLElement>) => void;
  handleCreateGroup: (event: React.MouseEvent<HTMLElement>) => void;
  handleLeaveGroup: (event: React.MouseEvent<HTMLElement>) => void;
  activeGroup?: Group;
}

const GroupOverview: React.FC<GroupOverviewProps> = ({
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
                <Typography component="h4" className={classes.groupName}>{activeGroup.name}</Typography>
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
