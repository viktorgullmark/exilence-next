import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  Input,
} from '@mui/material';
import Slider from '@mui/material/Slider';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

import useStyles from './SliderSetting.styles';

type SliderSettingProps = {
  value: number;
  handleChange: (value: number | string | number[]) => void;
  translationKey: string;
  step?: number;
  requiresSnapshot?: boolean;
};

const SliderSetting = ({
  value,
  handleChange,
  translationKey,
  requiresSnapshot,
}: SliderSettingProps) => {
  const [localValue, setLocalValue] = useState<number | string | number[]>(value);
  const classes = useStyles();
  const { t } = useTranslation();
  const step = 10;
  const defaultValue = 100;
  const min = 50;
  const max = 150;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.target.value === '' ? '' : Number(event.target.value));
    handleChange(+event.target.value);
  };

  const handleBlur = () => {
    if (localValue < 0) {
      setLocalValue(50);
    } else if (localValue > 150) {
      setLocalValue(150);
    }
  };

  const resetToDefault = () => {
    handleChange(defaultValue);
    setLocalValue(defaultValue);
  };

  return (
    <FormControl component="fieldset" className={classes.root}>
      <FormGroup>
        <FormLabel id={`${translationKey}-label`} className={classes.label}>
          {t(`label.${translationKey}`)} {requiresSnapshot ? '*' : ''}
        </FormLabel>
        <Box mt={2}>
          <div className={classes.container}>
            <ZoomInIcon className={classes.icon} />
            <Slider
              value={typeof localValue === 'number' ? localValue : 0}
              getAriaValueText={(val) => `${val} %`}
              aria-labelledby={`${translationKey}-label`}
              step={step}
              min={min}
              className={classes.slider}
              max={max}
              onChangeCommitted={(_e, v) => {
                handleChange(v);
              }}
              onChange={(_e, v) => {
                setLocalValue(v);
              }}
              valueLabelDisplay="auto"
            />
            <Input
              className={classes.input}
              value={localValue}
              margin="dense"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step,
                min,
                max,
                type: 'number',
                'aria-labelledby': 'input-slider',
              }}
            />
            {localValue !== defaultValue && (
              <Button size="small" variant="contained" color="primary" onClick={resetToDefault}>
                {t('label.reset_to_default')}
              </Button>
            )}
          </div>
        </Box>
        <FormHelperText>{t(`helper_text.${translationKey}`)}</FormHelperText>
      </FormGroup>
    </FormControl>
  );
};

export default SliderSetting;
