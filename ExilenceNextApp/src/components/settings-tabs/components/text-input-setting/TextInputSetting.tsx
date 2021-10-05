import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, FormGroup, FormHelperText, FormLabel, TextField } from '@mui/material';

import useStyles from './TextInputSetting.styles';

type TextInputSettingProps = {
  value: string;
  handleChange: (value: string) => void;
  translationKey: string;
  disabled?: boolean;
};

const TextInputSetting = ({
  value,
  handleChange,
  translationKey,
  disabled,
}: TextInputSettingProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <FormControl component="fieldset">
      <FormGroup>
        <FormLabel id={`${translationKey}-label`}>{t(`label.${translationKey}`)}</FormLabel>
        <TextField
          className={classes.root}
          id={`${translationKey}-label`}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          disabled={disabled}
        />
        <FormHelperText>{t(`helper_text.${translationKey}`)}</FormHelperText>
      </FormGroup>
    </FormControl>
  );
};

export default TextInputSetting;
