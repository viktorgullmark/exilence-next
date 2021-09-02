import React from 'react';
import { Button } from '@material-ui/core';
import { ITftColumnPreset } from '../../interfaces/tft-column-preset.interface';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../index';

type PresetButtonProps = {
  selected: boolean;
  preset: ITftColumnPreset;
  onPresetSelect: (preset: ITftColumnPreset) => void;
};

const PresetButton = ({ selected, preset, onPresetSelect }: PresetButtonProps) => {
  const { uiStateStore } = useStores();
  const { t } = useTranslation();

  return (
    <Button
      variant={selected ? 'contained' : 'outlined'}
      size="small"
      onClick={() => onPresetSelect(preset)}
      disabled={uiStateStore!.tftGeneratingImage}
    >
      {t(preset.name)}
    </Button>
  );
};

export default PresetButton;
