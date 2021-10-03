import React, { useEffect, useMemo } from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '../expansion-panel/ExpansionPanel';
import { Box, Grid, InputAdornment, TextField, Typography, useTheme } from '@mui/material';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { useStores } from '../../index';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

const BulkSellPrerequisitesPanel = () => {
  const { accountStore, signalrStore, uiStateStore } = useStores();
  const theme = useTheme();
  const { t } = useTranslation();
  const { activeLeague, activePriceLeague, activeCharacter } = accountStore!.getSelectedAccount;
  const activeProfile = accountStore!.getSelectedAccount.activeProfile;
  const { activeGroup } = signalrStore!;
  const getItems = useMemo(() => {
    if (activeProfile) {
      return activeGroup ? activeGroup.items : activeProfile.items;
    } else {
      return [];
    }
  }, [activeProfile, activeProfile?.items, activeGroup?.items, activeGroup]);

  const currentItemsTableValue = getItems.map((i) => i.total).reduce((a, b) => a + b, 0);

  useEffect(() => {
    uiStateStore!.setBulkSellAskingPrice(Math.round(+currentItemsTableValue));
    uiStateStore!.setBulkSellAskingPricePercentage(100);
    uiStateStore!.setBulkSellGeneratedMessage(
      `WTS ${activeLeague?.id ?? ''} | \`${Math.round(+currentItemsTableValue) || 0}c\` | \`IGN: ${
        activeCharacter?.name ?? ''
      }\``
    );
  }, [activeCharacter?.name, currentItemsTableValue]);

  const handleAskingPriceChange = (e) => {
    const pricePercentage = (e.currentTarget.value / +currentItemsTableValue) * 100;
    uiStateStore!.setBulkSellAskingPrice(Math.round(e.currentTarget.value));
    uiStateStore!.setBulkSellAskingPricePercentage(+pricePercentage.toFixed(2));
    uiStateStore!.setBulkSellGeneratedMessage(
      `WTS ${activeLeague?.id ?? ''} | \`${Math.round(e.currentTarget.value) || 0}c\` | \`IGN: ${
        activeCharacter?.name ?? ''
      }\``
    );
  };

  const handleAskingPricePercentageChange = (e) => {
    const { value: percentage } = e.currentTarget;
    const percentageAbove = (+percentage - 100) / 100;

    const calculateAskingPrice =
      +percentage <= 100
        ? +currentItemsTableValue * (+percentage / 100)
        : +currentItemsTableValue * +percentageAbove.toFixed(2);
    const sumAskingPrice =
      +percentage <= 100
        ? Math.round(calculateAskingPrice)
        : Math.round(+currentItemsTableValue + calculateAskingPrice);

    uiStateStore!.setBulkSellAskingPrice(sumAskingPrice);
    uiStateStore!.setBulkSellAskingPricePercentage(+percentage);
    uiStateStore!.setBulkSellGeneratedMessage(
      `WTS ${activeLeague?.id ?? ''} | \`${sumAskingPrice || 0}c\` | \`IGN: ${
        activeCharacter?.name ?? ''
      }\``
    );
  };

  return (
    <Accordion expanded>
      <AccordionSummary>
        <Box display="flex" justifyContent="center" alignItems="center">
          <PlaylistAddCheckIcon fontSize="small" />
          <Box ml={1}>
            <Typography variant="overline">{t('label.prerequisites')}</Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        style={{
          height: 240,
          background: theme.palette.background.default,
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <TextField
              variant="standard"
              style={{ width: 255 }}
              value={`${currentItemsTableValue.toFixed(2)}c` ?? ''}
              disabled
              label={t('label.current_price')}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              type="number"
              variant="standard"
              label={t('label.asking_price')}
              value={uiStateStore!.bulkSellAskingPrice}
              onChange={handleAskingPriceChange}
              disabled={uiStateStore!.bulkSellGeneratingImage}
              InputProps={{
                startAdornment: <InputAdornment position="start">chaos</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={4} alignItems="center">
            <TextField
              type="number"
              variant="standard"
              style={{ width: 111 }}
              value={uiStateStore!.bulkSellAskingPricePercentage}
              onChange={handleAskingPricePercentageChange}
              label={t('label.asking_price_percentage')}
              disabled={uiStateStore!.bulkSellGeneratingImage}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={4}>
            <TextField
              variant="standard"
              style={{ width: '100%' }}
              value={activeLeague?.id ?? ''}
              disabled
              label={t('label.active_league')}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="standard"
              style={{ width: '100%' }}
              value={activePriceLeague?.id ?? ''}
              disabled
              label={t('label.price_league')}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              disabled
              variant="standard"
              label={t('label.ign')}
              value={activeCharacter?.name ?? ''}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="standard"
              label={t('label.generated_message')}
              disabled
              style={{ width: '100%' }}
              value={uiStateStore!.bulkSellGeneratedMessage}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default observer(BulkSellPrerequisitesPanel);
