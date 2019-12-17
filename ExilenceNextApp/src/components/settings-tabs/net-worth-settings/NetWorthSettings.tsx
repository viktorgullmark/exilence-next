import { createStyles, Grid, makeStyles } from '@material-ui/core';
import { observer } from 'mobx-react';
import React from 'react';
import { ISelectOption } from '../../../interfaces/select-option.interface';
import CheckboxSetting from '../checkbox-setting/CheckboxSetting';
import SelectSetting from '../select-setting/SelectSetting';

const useStyles = makeStyles(theme =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    label: {
      '& + .MuiInput-formControl': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
      }
    }
  })
);

interface Props {
  lowConfidencePricing: boolean;
  priceTreshold: number;
  priceTresholdOptions: ISelectOption[];
  setLowConfidencePricing: (value: boolean) => void;
  setPriceTreshold: (value: number) => void;
}

const NetWorthSettings: React.FC<Props> = ({
  lowConfidencePricing,
  priceTreshold,
  setLowConfidencePricing,
  setPriceTreshold,
  priceTresholdOptions
}: Props) => {
  return (
    <Grid container>
      <Grid item xs={12} sm={4}>
        <CheckboxSetting
          value={lowConfidencePricing}
          handleChange={setLowConfidencePricing}
          translationKey="low_confidence_pricing"
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <SelectSetting
          options={priceTresholdOptions}
          value={priceTreshold}
          handleChange={(value: number) => setPriceTreshold(value)}
          translationKey="price_treshold"
        />
      </Grid>
    </Grid>
  );
};

export default observer(NetWorthSettings);
