import React from 'react';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '../expansion-panel/ExpansionPanel';
import { Box, Grid, Typography, useTheme } from '@material-ui/core';
import ViewColumnsIcon from '@material-ui/icons/ViewColumn';
import { useTranslation } from 'react-i18next';
import SUPPORTED_PRESETS from './supportedPresets';
import PresetButton from './PresetButton';
import { useStores } from '../../index';
import { ITftColumnPreset } from '../../interfaces/tft-column-preset.interface';
import { observer } from 'mobx-react-lite';

const TftColumnPresetsPanel = () => {
  const { uiStateStore } = useStores();
  const theme = useTheme();
  const { t } = useTranslation();

  const onPresetSelect = (preset: ITftColumnPreset) => uiStateStore!.setTftActivePreset(preset);

  return (
    <ExpansionPanel expanded>
      <ExpansionPanelSummary>
        <Box display="flex" justifyContent="center" alignItems="center">
          <ViewColumnsIcon fontSize="small" />
          <Box ml={1}>
            <Typography variant="overline">{t('label.column_presets')}</Typography>
          </Box>
        </Box>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        style={{
          height: 52,
          background: theme.palette.background.default,
        }}
      >
        <Grid container spacing={2}>
          {SUPPORTED_PRESETS.map((preset) => (
            <PresetButton
              key={preset.name}
              selected={preset.name === uiStateStore!.tftActivePreset?.name}
              preset={preset}
              onPresetSelect={onPresetSelect}
            />
          ))}
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default observer(TftColumnPresetsPanel);
