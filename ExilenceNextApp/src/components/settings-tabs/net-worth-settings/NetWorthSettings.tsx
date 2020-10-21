import React from 'react';
import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react';

import CheckboxSetting from '../checkbox-setting/CheckboxSetting';
import NumberInputSetting from '../number-input-setting/NumberInputSetting';

type NetWorthSettingsProps = {
  lowConfidencePricing: boolean;
  priceTreshold: number;
  totalPriceTreshold: number;
  setLowConfidencePricing: (value: boolean) => void;
  setPriceTreshold: (value: number) => void;
  setTotalPriceTreshold: (value: number) => void;
};

const NetWorthSettings = ({
  lowConfidencePricing,
  priceTreshold,
  totalPriceTreshold,
  setLowConfidencePricing,
  setPriceTreshold,
  setTotalPriceTreshold,
}: NetWorthSettingsProps) => {
  return (
    <Grid container spacing={5}>
      <Grid item>
        <CheckboxSetting
          value={lowConfidencePricing}
          handleChange={setLowConfidencePricing}
          translationKey="low_confidence_pricing"
          requiresSnapshot
        />
      </Grid>
      <Grid item>
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
      <Grid item>
        <NumberInputSetting
          value={totalPriceTreshold}
          handleChange={(value: number) => setTotalPriceTreshold(value)}
          translationKey="total_price_treshold"
          minimum={0}
          maximum={5000}
          suffixKey="unit.chaos"
          requiresSnapshot
        />
      </Grid>
    </Grid>
  );
};

export default observer(NetWorthSettings);
