import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../../../..';
import CheckboxSetting from '../../components/checkbox-setting/CheckboxSetting';
import NumberInputSetting from '../../components/number-input-setting/NumberInputSetting';

const NetWorthSettings = () => {
  const { settingStore } = useStores();
  return (
    <Grid container spacing={5}>
      <Grid item>
        <CheckboxSetting
          value={settingStore!.lowConfidencePricing}
          handleChange={(value: boolean) => settingStore!.setLowConfidencePricing(value)}
          translationKey="low_confidence_pricing"
          requiresSnapshot
        />
      </Grid>
      <Grid item>
        <NumberInputSetting
          value={settingStore!.priceThreshold}
          handleChange={(value: number) => settingStore!.setPriceThreshold(value)}
          translationKey="price_threshold"
          minimum={0}
          maximum={100}
          suffixKey="unit.chaos"
          requiresSnapshot
        />
      </Grid>
      <Grid item>
        <NumberInputSetting
          value={settingStore!.totalPriceThreshold}
          handleChange={(value: number) => settingStore!.setTotalPriceThreshold(value)}
          translationKey="total_price_threshold"
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
