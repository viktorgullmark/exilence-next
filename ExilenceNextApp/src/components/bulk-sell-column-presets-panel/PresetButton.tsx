import React from 'react';
import { Button } from '@mui/material';
import { IBulkSellColumnPreset } from '../../interfaces/bulk-sell-column-preset.interface';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../index';

type PresetButtonProps = {
  selected: boolean;
  preset: IBulkSellColumnPreset;
  onPresetSelect: (preset: IBulkSellColumnPreset) => void;
};

const PresetButton = ({ selected, preset, onPresetSelect }: PresetButtonProps) => {
  const { uiStateStore } = useStores();
  const { t } = useTranslation();

  return (
    <Button
      variant={selected ? 'contained' : 'outlined'}
      size="small"
      onClick={() => onPresetSelect(preset)}
      disabled={uiStateStore!.bulkSellGeneratingImage}
    >
      {t(preset.name)}
    </Button>
  );
};

export default PresetButton;
