import React, { useEffect, useState } from 'react';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '../expansion-panel/ExpansionPanel';
import { Box, Button, Grid, Typography, useTheme } from '@material-ui/core';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import { useStores } from '../../index';
import { useTranslation } from 'react-i18next';
import { toBlob } from 'html-to-image';
import { observer } from 'mobx-react-lite';

const TftStepsPanel = () => {
  const [isExtractingImageSuccessMsg, setIsExtractingImageSuccessMsg] = useState(false);
  const { uiStateStore } = useStores();
  const theme = useTheme();
  const { t } = useTranslation();
  const timer: NodeJS.Timeout | undefined = undefined;

  useEffect(() => {
    if (isExtractingImageSuccessMsg) {
      const imageExtractingSuccessMsgTimer = setTimeout(
        () => setIsExtractingImageSuccessMsg(false),
        5000
      );
      return () => clearTimeout(imageExtractingSuccessMsgTimer);
    }
    // @ts-ignore
    return () => clearTimeout(timer);
  }, [isExtractingImageSuccessMsg]);

  useEffect(() => {
    return uiStateStore!.setTftGeneratingImage(false);
  }, []);

  const handleGenerateImage = () => {
    uiStateStore!.setTftGeneratingImage(true);
    generateImage();
  };

  const generateImage = () => {
    const table = document.getElementById('items-table');
    const tableInput = document.getElementById('items-table-input');
    const tableActions = document.getElementById('items-table-actions');

    if (table) {
      if (tableInput && tableActions) {
        tableInput.style.display = 'none';
        tableActions.style.display = 'none';
      }
      toBlob(table)
        .then(function (blob) {
          const type = 'text/plain';
          const textBlob = new Blob([uiStateStore!.tftGeneratedMessage], { type });

          navigator.clipboard
            // @ts-ignore
            .write([
              // @ts-ignore
              new ClipboardItem({
                'image/png': blob,
                'text/plain': textBlob,
              }),
            ])
            .catch((e) => console.log(e));
          setIsExtractingImageSuccessMsg(true);
        })
        .catch((err) => console.log(err))
        .finally(() => {
          uiStateStore!.setTftGeneratingImage(false);
          if (tableInput && tableActions) {
            tableInput.style.display = 'flex';
            tableActions.style.display = 'flex';
          }
        });
    }
  };

  return (
    <ExpansionPanel expanded>
      <ExpansionPanelSummary>
        <Box display="flex" justifyContent="center" alignItems="center">
          <PlaylistAddCheckIcon fontSize="small" />
          <Box ml={1}>
            <Typography variant="overline">{t('label.steps')}</Typography>
          </Box>
        </Box>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        style={{
          height: 240,
          background: theme.palette.background.default,
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            1. Set <b>{t('label.asking_price')}</b>
          </Grid>
          <Grid item xs={12}>
            2. <b>{t('label.generate_image')}</b>
          </Grid>
          <Grid item xs={12}>
            3. <b>{t('label.open_tft')}</b>
          </Grid>
          <Grid item xs={12}>
            4. {t('label.paste')} <b>{t('label.twice')}</b> {t('label.paste_reason')}
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateImage}
              disabled={uiStateStore!.tftGeneratingImage}
            >
              {isExtractingImageSuccessMsg
                ? t('label.generated_image_success')
                : t(
                    uiStateStore!.tftGeneratingImage
                      ? 'label.generating_image'
                      : 'label.generate_image'
                  )}
            </Button>
          </Grid>
          <Grid
            item
            xs={6}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-start',
            }}
          >
            <Button variant="outlined">{t('label.tft_demo')}</Button>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default observer(TftStepsPanel);
