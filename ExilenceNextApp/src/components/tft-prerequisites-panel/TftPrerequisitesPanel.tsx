import React, { useEffect, useState } from 'react';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '../expansion-panel/ExpansionPanel';
import { Box, Grid, TextField, Typography, useTheme } from '@material-ui/core';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import { useStores } from '../../index';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

const TftPrerequisitesPanel = () => {
  const { accountStore, uiStateStore } = useStores();
  const [askingPrice, setAskingPrice] = useState('');
  const theme = useTheme();
  const { t } = useTranslation();
  const { activeLeague, activePriceLeague, activeCharacter } = accountStore!.getSelectedAccount;

  useEffect(() => {
    uiStateStore!.setTftGeneratedMessage(
      `WTS ${activeLeague?.id ?? ''} | \`${askingPrice}\` | \`IGN: ${activeCharacter?.name ?? ''}\``
    );
  }, [activeCharacter?.name]);

  const handleAskingPriceChange = (e) => {
    setAskingPrice(e.currentTarget.value);
    uiStateStore!.setTftGeneratedMessage(
      `WTS ${activeLeague?.id ?? ''} | \`${e.currentTarget.value}\` | \`IGN: ${
        activeCharacter?.name ?? ''
      }\``
    );
  };

  return (
    <ExpansionPanel expanded>
      <ExpansionPanelSummary>
        <Box display="flex" justifyContent="center" alignItems="center">
          <PlaylistAddCheckIcon fontSize="small" />
          <Box ml={1}>
            <Typography variant="overline">{t('label.prerequisites')}</Typography>
          </Box>
        </Box>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        style={{
          height: 240,
          background: theme.palette.background.default,
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <TextField
              label={t('label.asking_price')}
              value={askingPrice}
              onChange={handleAskingPriceChange}
              disabled={uiStateStore!.tftGeneratingImage}
            />
          </Grid>
          <Grid item xs={9} />
          <Grid item xs={4}>
            <TextField
              style={{ width: 250 }}
              value={activeLeague?.id ?? ''}
              disabled
              label={t('label.active_league')}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              style={{ width: 250 }}
              value={activePriceLeague?.id ?? ''}
              disabled
              label={t('label.price_league')}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              disabled
              label={t('label.ign')}
              value={activeCharacter?.name ?? ''}
              style={{ width: 250 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={t('label.generated_message')}
              disabled
              style={{ width: '100%' }}
              value={uiStateStore!.tftGeneratedMessage}
            />
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default observer(TftPrerequisitesPanel);
