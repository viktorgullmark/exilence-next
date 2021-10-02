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
} from '@mui/material';

import useStyles from './CheckboxSetting.styles';

type CheckboxSettingProps = {
  value: boolean;
  handleChange: (value: boolean) => void;
  translationKey: string;
  helperTextKey?: string;
  labelKey?: string;
  requiresSnapshot?: boolean;
};

const CheckboxSetting = ({
  value,
  handleChange,
  translationKey,
  helperTextKey,
  labelKey,
  requiresSnapshot,
}: CheckboxSettingProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">
        {t(`label.${labelKey || translationKey}`)} {requiresSnapshot ? '*' : ''}
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
      <FormHelperText className={classes.helperText}>
        {t(`helper_text.${helperTextKey || translationKey}`)}
      </FormHelperText>
    </FormControl>
  );
};

export default CheckboxSetting;
