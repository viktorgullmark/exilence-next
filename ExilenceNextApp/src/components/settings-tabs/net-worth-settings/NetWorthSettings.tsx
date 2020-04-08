import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import React from 'react';
import CheckboxSetting from '../checkbox-setting/CheckboxSetting';
import NumberInputSetting from '../number-input-setting/NumberInputSetting';

interface Props {
  lowConfidencePricing: boolean;
  priceTreshold: number;
  setLowConfidencePricing: (value: boolean) => void;
  setPriceTreshold: (value: number) => void;
}

const NetWorthSettings: React.FC<Props> = ({
  lowConfidencePricing,
  priceTreshold,
  setLowConfidencePricing,
  setPriceTreshold,
}: Props) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <CheckboxSetting
          value={lowConfidencePricing}
          handleChange={setLowConfidencePricing}
          translationKey="low_confidence_pricing"
          requiresSnapshot
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <NumberInputSetting
          value={priceTreshold}
          handleChange={(value: number) => setPriceTreshold(value)}
          translationKey="price_treshold"
          minimum={0}
          maximum={100}
          suffixKey="unit.chaos"
          requiresSnapshot
        />
      </Grid>
    </Grid>
  );
};

export default observer(NetWorthSettings);
