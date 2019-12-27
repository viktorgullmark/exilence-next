import { Divider, Drawer, IconButton } from '@material-ui/core';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { resizeHandleContainerHeight, toolbarHeight } from '../../header/Header';

export const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    height: `calc(100% - ${toolbarHeight}px)`,
    top: `calc(${toolbarHeight}px + ${resizeHandleContainerHeight}px)`,
    width: drawerWidth
  },
  drawerHeader: {
    background: theme.palette.secondary.main,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    justifyContent: 'flex-end'
  }
}));

interface GroupOverviewProps {
  open: boolean;
  toggleGroupOverview: () => void;
}

const GroupOverview: React.FC<GroupOverviewProps> = ({
  open,
  toggleGroupOverview
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
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      content-here
    </Drawer>
  );
};

export default observer(GroupOverview);
