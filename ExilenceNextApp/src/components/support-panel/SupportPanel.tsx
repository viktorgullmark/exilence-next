import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper, { PopperProps } from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import RedirectIcon from '@material-ui/icons/CallMade';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import FavoriteIcon from '@material-ui/icons/Favorite';
import HistoryIcon from '@material-ui/icons/History';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import { observer } from 'mobx-react-lite';
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useStores } from '../..';
import { openLink } from '../../utils/window.utils';
import CreditsDialog from '../credits-dialog/CreditsDialog';
import WhatsNewDialog from '../whats-new-dialog/WhatsNewDialog';
import useStyles from './SupportPanel.styles';
type SupportPanelProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
} & Pick<PopperProps, 'anchorEl'>;
import TftLogo from '../../assets/img/tft.png'

const SupportPanel = ({ isOpen = false, setIsOpen, anchorEl = null }: SupportPanelProps) => {
  const { uiStateStore } = useStores();
  const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isLoginRoute = pathname === '/login';
  const closeSupportPanel = useCallback(() => setIsOpen(false), [setIsOpen, isOpen]);

  const handleLinkClick = (e) => {
    openLink(e);
    closeSupportPanel();
  };

  const handleRetakeTourClick = () => {
    uiStateStore!.setToolbarTourOpen(true);
    closeSupportPanel();
  };

  const handleWhatsNewClick = () => {
    setIsWhatsNewOpen((isWhatsNewOpen) => !isWhatsNewOpen);
    closeSupportPanel();
  };

  const handleCreditsClick = () => {
    setIsCreditsOpen((isCreditsOpen) => !isCreditsOpen);
    closeSupportPanel();
  };

  return (
    <>
      <Popper
        open={isOpen}
        anchorEl={anchorEl}
        placement="bottom-end"
        className={classes.popper}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper className={classes.paper} elevation={8}>
              <ul className={classes.list}>
                <a
                  href="https://discord.gg/yxuBrPY"
                  onClick={(e) => handleLinkClick(e)}
                  className={classes.optionLink}
                >
                  <Typography variant="body2">{t('label.discord')}</Typography>
                  <RedirectIcon className={classes.icon} />
                </a>
                {/*<li className={classes.option}>*/}
                {/*  <Typography variant="body2">{t('label.faq')}</Typography>*/}
                {/*</li>*/}
                <li className={classes.option} onClick={handleWhatsNewClick}>
                  <Typography variant="body2">{t('label.whats_new')}</Typography>
                  <StarRoundedIcon className={classes.icon} />
                </li>
                {!isLoginRoute && (
                  <li className={classes.option} onClick={handleRetakeTourClick}>
                    <Typography variant="body2">{t('label.retake_tour')}</Typography>
                    <HistoryIcon className={classes.icon} />
                  </li>
                )}
                <div className={classes.separator} />
                <a
                  href="https://github.com/viktorgullmark/exilence-next/issues/new?template=feature_request.md"
                  onClick={(e) => handleLinkClick(e)}
                  className={classes.optionLink}
                >
                  <Typography variant="body2">{t('label.feature_request')}</Typography>
                </a>
                <a
                  href="https://github.com/viktorgullmark/exilence-next/issues/new?template=bug_report.md"
                  onClick={(e) => handleLinkClick(e)}
                  className={classes.optionLink}
                >
                  <Typography variant="body2">{t('label.bug_report')}</Typography>
                </a>
                <div className={classes.separator} />
                <a
                  href="https://discord.gg/yxuBrPY"
                  onClick={(e) => handleLinkClick(e)}
                  className={classes.optionLink}
                >
                  <Typography variant="body2">{t('label.tft_discord')}</Typography>
                  <img src={TftLogo} width={20} height={20} />
                </a>
                <div className={classes.separator} />
                <a
                  href="https://www.patreon.com/exilence"
                  onClick={(e) => handleLinkClick(e)}
                  className={classes.optionLink}
                >
                  <Typography variant="body2">{t('label.support_us')}</Typography>
                  <FavoriteIcon className={classes.icon} />
                </a>
                <li className={classes.option} onClick={handleCreditsClick}>
                  <Typography variant="body2">{t('label.credits')}</Typography>
                  <CardGiftcardIcon className={classes.icon} />
                </li>
              </ul>
            </Paper>
          </Fade>
        )}
      </Popper>
      <WhatsNewDialog open={isWhatsNewOpen} onClose={handleWhatsNewClick} />
      <CreditsDialog open={isCreditsOpen} onClose={handleCreditsClick} />
    </>
  );
};

export default observer(SupportPanel);
