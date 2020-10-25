import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Popper, { PopperProps } from '@material-ui/core/Popper';
import { useTranslation } from 'react-i18next';
import HistoryIcon from '@material-ui/icons/History';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import RedirectIcon from '@material-ui/icons/CallMade';

import useStyles from './SupportPanel.styles';
import { UiStateStore } from '../../store/uiStateStore';
import { openLink } from '../../utils/window.utils';

type SupportPanelProps = {
  uiStateStore?: UiStateStore;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
} & Pick<PopperProps, 'anchorEl'>;

const SupportPanel = ({
  uiStateStore,
  isOpen = false,
  setIsOpen,
  anchorEl = null,
}: SupportPanelProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const closeSupportPanel = useCallback(() => setIsOpen(!isOpen), [setIsOpen, isOpen]);

  const handleDiscordClick = (e) => {
    openLink(e);
    closeSupportPanel();
  };

  const handleRetakeTourClick = () => {
    uiStateStore!.setToolbarTourOpen(true);
    closeSupportPanel();
  };

  return (
    <Popper
      open={isOpen}
      anchorEl={anchorEl}
      placement="bottom-end"
      className={classes.popper}
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <Paper className={classes.paper} elevation={3}>
            <ul className={classes.list}>
              <li className={classes.option}>
                <a
                  href="https://discord.gg/yxuBrPY"
                  onClick={(e) => handleDiscordClick(e)}
                  className={classes.optionLink}
                >
                  <Typography variant="body2">{t('label.get_help')}</Typography>
                  <RedirectIcon className={classes.icon} />
                </a>
              </li>
              <li className={classes.option} onClick={handleRetakeTourClick}>
                <Typography variant="body2">{t('label.retake_tour')}</Typography>

                <HistoryIcon className={classes.icon} />
              </li>
              <li className={classes.option}>
                <Typography variant="body2">{t('label.whats_new')}</Typography>
                <StarRoundedIcon className={classes.icon} />
              </li>
            </ul>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default inject('uiStateStore')(observer(SupportPanel));
