import React from 'react';
import { Grid, IconButton, Tooltip } from '@mui/material';
import useStyles from './OverlayAreaGridItem.styles';
import { useTranslation } from 'react-i18next';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';

type OverlayAreaGridItemProps = {
  handleOverlay: () => void;
};

const OverlayAreaGridItem = ({ handleOverlay }: OverlayAreaGridItemProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid item className={classes.overlayArea} data-tour-elem="overlayArea">
      <Tooltip title={t('label.overlay_icon_title') || ''} placement="bottom">
        <span>
          <IconButton
            onClick={() => handleOverlay()}
            aria-label="overlay"
            aria-haspopup="true"
            className={classes.iconButton}
            size="large"
          >
            <AddToPhotosIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Grid>
  );
};

export default OverlayAreaGridItem;
