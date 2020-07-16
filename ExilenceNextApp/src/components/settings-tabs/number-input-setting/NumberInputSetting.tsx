import {
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  TextField
} from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './NumberInputSetting.styles';
import NumberFormat from 'react-number-format';

interface Props {
  value: number;
  handleChange: (value: number) => void;
  translationKey: string;
  requiresSnapshot?: boolean;
  suffixKey?: string,
  minimum: number,
  maximum: number,
  disabled?: boolean;
}

const NumberInputFormat = (props: any) => {
  const { inputRef, onChange, suffix, minimum, maximum, ...other} = props;
  
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      isNumericString
      thousandSeparator
      suffix={suffix}
      isAllowed={values => {
        const { floatValue } = values;
        return floatValue >= minimum && floatValue <= maximum;
      }}
    />
  );
};

const NumberInputSetting: React.FC<Props> = ({
  value,
  handleChange,
  translationKey,
  requiresSnapshot,
  suffixKey,
  minimum,
  maximum,
  disabled
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const suffix = suffixKey ? ' '+t(suffixKey) : '';

  return (
    <FormControl component="fieldset">
      <FormGroup>
        <FormLabel id={`${translationKey}-label`}>
          {t(`label.${translationKey}`)} {requiresSnapshot ? '*' : ''}
        </FormLabel>
        <TextField
          className={classes.root}
          id={`${translationKey}-label`}
          value={value}
          onChange={e => handleChange(+e.target.value)}
          InputProps={{
            inputComponent: NumberInputFormat,
            inputProps: {
              suffix,
              minimum,
              maximum,
            }
          }}
          disabled={disabled}
        ></TextField>
        <FormHelperText>{t(`helper_text.${translationKey}`)}</FormHelperText>
      </FormGroup>
    </FormControl>
  );
};

export default NumberInputSetting;
