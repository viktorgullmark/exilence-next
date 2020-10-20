import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Typography,
} from '@material-ui/core';

import useStyles from './CheckboxSetting.styles';

type CheckboxSettingProps = {
  value: boolean;
  handleChange: (value: boolean) => void;
  translationKey: string;
  requiresSnapshot?: boolean;
};

const CheckboxSetting = ({
  value,
  handleChange,
  translationKey,
  requiresSnapshot,
}: CheckboxSettingProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">
        {t(`label.${translationKey}`)} {requiresSnapshot ? '*' : ''}
      </FormLabel>
      <FormGroup className={classes.checkBox}>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={value}
              onChange={() => handleChange(!value)}
              value="low-confidence"
            />
          }
          label={
            <Typography className={classes.checkBoxValue}>
              {t(`value.${translationKey}`)}
            </Typography>
          }
        />
      </FormGroup>
      <FormHelperText>{t(`helper_text.${translationKey}`)}</FormHelperText>
    </FormControl>
  );
};

export default CheckboxSetting;
