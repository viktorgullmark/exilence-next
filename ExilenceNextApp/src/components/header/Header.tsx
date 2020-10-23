import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppBar, Link, Toolbar } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CloseIcon from '@material-ui/icons/Close';
import FilterNone from '@material-ui/icons/FilterNone';
import MinimizeIcon from '@material-ui/icons/Minimize';
import clsx from 'clsx';
import { observer } from 'mobx-react';

import { close, maximize, minimize, unmaximize } from '../../utils/window.utils';
import useStyles from './Header.styles';

export const resizeHandleContainerHeight = 5;
export const toolbarHeight = 30;

type HeaderProps = {
  maximized: boolean;
  setMaximized: (maximized: boolean) => void;
  currentVersion: string;
  updateAvailable: boolean;
  quitAndInstall: () => void;
};

const Header = ({
  maximized,
  setMaximized,
  currentVersion,
  updateAvailable,
  quitAndInstall,
}: HeaderProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <AppBar position="fixed" color="secondary" className={classes.header}>
      <div className={clsx(classes.noDrag, classes.resizeHandleContainer)} />
      <Toolbar className={classes.toolbar}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Typography variant="h6" noWrap className={classes.title}>
                  Exilence Next
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subtitle2" noWrap className={classes.version}>
                  v.{currentVersion}
                </Typography>
              </Grid>
              {updateAvailable && (
                <Grid item onClick={quitAndInstall}>
                  <Typography
                    variant="subtitle2"
                    noWrap
                    className={clsx(classes.updateAvailable, classes.noDrag)}
                  >
                    {t('label.update_available')}
                    {t('label.click')}
                    &nbsp;
                    <Link className={classes.updateLink}>{t('label.here')}</Link>
                    &nbsp;
                    {t('label.to_update_now')}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item>
            <Grid container alignItems="center">
              <Grid
                item
                className={clsx(classes.noDrag, classes.windowHandlerButton)}
                onClick={() => minimize()}
              >
                <MinimizeIcon className={classes.windowIcon} />
              </Grid>
              <Grid
                item
                className={clsx(classes.noDrag, classes.windowHandlerButton)}
                onClick={
                  !maximized
                    ? () => {
                        maximize();
                        setMaximized(true);
                      }
                    : () => {
                        unmaximize();
                        setMaximized(false);
                      }
                }
              >
                {!maximized ? (
                  <CheckBoxOutlineBlankIcon className={classes.windowIcon} />
                ) : (
                  <FilterNone className={classes.windowIcon} />
                )}
              </Grid>
              <Grid
                item
                className={clsx(classes.noDrag, classes.windowHandlerButton, classes.exit)}
                onClick={() => close()}
              >
                <CloseIcon className={classes.windowIcon} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default observer(Header);
