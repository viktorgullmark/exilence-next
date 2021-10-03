import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, FormGroup, FormHelperText, FormLabel, MenuItem, Select } from '@mui/material';

import { ISelectOption } from '../../../../interfaces/select-option.interface';
import useStyles from './SelectSetting.styles';

type SelectSettingProps = {
  value: number | string;
  options: ISelectOption[];
  handleChange: (value: any) => void;
  translationKey: string;
  requiresSnapshot?: boolean;
  maxWidth?: number;
  withNone?: boolean;
};

const SelectSetting = ({
  value,
  options,
  handleChange,
  translationKey,
  requiresSnapshot,
  maxWidth = 150,
  withNone = true,
}: SelectSettingProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <FormControl component="fieldset">
      <FormGroup>
        <FormLabel id={`${translationKey}-label`} className={classes.label}>
          {t(`label.${translationKey}`)} {requiresSnapshot ? '*' : ''}
        </FormLabel>
        <Select
          labelId="price-threshold-label"
          id="price-threshold"
          value={value}
          onChange={(e) => handleChange(e.target.value as number)}
          displayEmpty
          style={{ maxWidth }}
          variant="standard"
        >
          {withNone && (
            <MenuItem value={0}>
              <em>{t('value.none')}</em>
            </MenuItem>
          )}
          {options.map((option) => {
            return (
              <MenuItem key={option.id} value={option.value}>
                {option.label ? option.label : option.value}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText className={classes.helperText}>
          {t(`helper_text.${translationKey}`)}
        </FormHelperText>
      </FormGroup>
    </FormControl>
  );
};

export default SelectSetting;
