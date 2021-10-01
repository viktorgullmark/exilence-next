import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary } from '../expansion-panel/ExpansionPanel';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import ViewColumnsIcon from '@mui/icons-material/ViewColumn';
import { useTranslation } from 'react-i18next';
import SUPPORTED_PRESETS from './supportedPresets';
import PresetButton from './PresetButton';
import { useStores } from '../../index';
import { IBulkSellColumnPreset } from '../../interfaces/bulk-sell-column-preset.interface';
import { observer } from 'mobx-react-lite';

const BulkSellColumnPresetsPanel = () => {
  const { uiStateStore } = useStores();
  const theme = useTheme();
  const { t } = useTranslation();

  const onPresetSelect = (preset: IBulkSellColumnPreset) =>
    uiStateStore!.setBulkSellActivePreset(preset);

  return (
    <Accordion expanded>
      <AccordionSummary>
        <Box display="flex" justifyContent="center" alignItems="center">
          <ViewColumnsIcon fontSize="small" />
          <Box ml={1}>
            <Typography variant="overline">{t('label.column_presets')}</Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        style={{
          height: 52,
          background: theme.palette.background.default,
        }}
      >
        <Grid container spacing={2}>
          {SUPPORTED_PRESETS.map((preset) => (
            <PresetButton
              key={preset.name}
              selected={preset.name === uiStateStore!.bulkSellActivePreset?.name}
              preset={preset}
              onPresetSelect={onPresetSelect}
            />
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default observer(BulkSellColumnPresetsPanel);
