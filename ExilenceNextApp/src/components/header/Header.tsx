import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppBar, Box, Link, Toolbar } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CloseIcon from '@mui/icons-material/Close';
import FilterNone from '@mui/icons-material/FilterNone';
import MinimizeIcon from '@mui/icons-material/Minimize';
import HelpIcon from '@mui/icons-material/HelpOutline';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import PatreonLogo from '../../assets/img/patreon-wordmark-black.png';
import { close, maximize, minimize, openLink, unmaximize } from '../../utils/window.utils';
import SupportPanel from '../support-panel/SupportPanel';
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
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const classes = useStyles();
  const { t } = useTranslation();

  const handleClick = (event: any) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <AppBar position="fixed" color="secondary" className={classes.header}>
      <div className={clsx(classes.noDrag, classes.resizeHandleContainer)} />
      <SupportPanel isOpen={isOpen} anchorEl={anchorEl} setIsOpen={setIsOpen} />
      <Toolbar className={classes.toolbar}>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
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
              <Grid item className={clsx(classes.noDrag)}>
                <a href="https://patreon.com/exilence" onClick={(e) => openLink(e)}>
                  <Box
                    display="flex"
                    alignItems="center"
                    height={1}
                    className={classes.patreonWrapper}
                  >
                    <img className={classes.patreonLogo} src={PatreonLogo} alt="patreon" />
                  </Box>
                </a>
              </Grid>
              <Grid
                item
                className={clsx(
                  classes.noDrag,
                  classes.windowHandlerButton,
                  isOpen && classes.isActive
                )}
                onClick={(e) => handleClick(e)}
                data-tour-elem="supportPanel"
              >
                <HelpIcon className={clsx(classes.windowIcon, classes.support)} />
              </Grid>
              <Grid
                item
                className={clsx(classes.noDrag, classes.windowHandlerButton)}
                onClick={minimize}
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
                onClick={close}
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
