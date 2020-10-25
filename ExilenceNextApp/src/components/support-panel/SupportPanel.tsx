import React from 'react';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Popper, { PopperProps } from '@material-ui/core/Popper';
import { useTranslation } from 'react-i18next';
import HistoryIcon from '@material-ui/icons/History';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import RedirectIcon from '@material-ui/icons/CallMade';

import useStyles from './SupportPanel.styles';

type SupportPanelProps = {
  isOpen: boolean;
} & Pick<PopperProps, 'anchorEl'>;

const SupportPanel = ({ isOpen = false, anchorEl = null }: SupportPanelProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

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
                <Typography variant="body2">{t('label.get_help')}</Typography>
                <RedirectIcon className={classes.icon} />
              </li>
              <li className={classes.option}>
                <Typography variant="body2">
                  {t('label.retake_tour')}
                </Typography>

                <HistoryIcon className={classes.icon} />
              </li>
              <li className={classes.option}>
                <Typography variant="body2">
                  {t('label.whats_new')}
                </Typography>
                <StarRoundedIcon className={classes.icon} />
              </li>
            </ul>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default SupportPanel;
