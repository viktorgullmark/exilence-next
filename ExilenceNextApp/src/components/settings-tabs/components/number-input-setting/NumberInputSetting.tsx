import React from 'react';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';
import { FormControl, FormGroup, FormHelperText, FormLabel, TextField } from '@mui/material';

import useStyles from './NumberInputSetting.styles';

type NumberInputSettingProps = {
  value: number;
  handleChange: (value: number) => void;
  translationKey: string;
  requiresSnapshot?: boolean;
  suffixKey?: string;
  minimum: number;
  maximum: number;
  disabled?: boolean;
};

const NumberInputFormat = (props: any) => {
  const { inputRef, onChange, suffix, minimum, maximum, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      isNumericString
      thousandSeparator
      suffix={suffix}
      isAllowed={(values) => {
        const { floatValue = 0 } = values;
        return floatValue >= minimum && floatValue <= maximum;
      }}
    />
  );
};

const NumberInputSetting = ({
  value,
  handleChange,
  translationKey,
  requiresSnapshot,
  suffixKey,
  minimum,
  maximum,
  disabled,
}: NumberInputSettingProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const suffix = suffixKey ? ` ${t(suffixKey)}` : '';

  return (
    <FormControl component="fieldset">
      <FormGroup>
        <FormLabel id={`${translationKey}-label`}>
          {t(`label.${translationKey}`)} {requiresSnapshot ? '*' : ''}
        </FormLabel>
        <TextField
          variant="standard"
          className={classes.root}
          id={`${translationKey}-label`}
          value={value}
          onChange={(e) => handleChange(+e.target.value)}
          InputProps={{
            inputComponent: NumberInputFormat,
            inputProps: {
              suffix,
              minimum,
              maximum,
            },
          }}
          disabled={disabled}
        />
        <FormHelperText className={classes.helperText}>
          {t(`helper_text.${translationKey}`)}
        </FormHelperText>
      </FormGroup>
    </FormControl>
  );
};

export default NumberInputSetting;
