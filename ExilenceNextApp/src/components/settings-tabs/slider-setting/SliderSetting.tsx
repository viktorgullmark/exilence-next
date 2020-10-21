import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
} from '@material-ui/core';
import Slider from '@material-ui/core/Slider';
import ZoomInIcon from '@material-ui/icons/ZoomIn';

import useStyles from './SliderSetting.styles';

type SliderSettingProps = {
  value: number;
  handleChange: (event: ChangeEvent<{}> | MouseEvent, value: number | string | number[]) => void;
  translationKey: string;
  step?: number;
  requiresSnapshot?: boolean;
};

const SliderSetting = ({
  value,
  handleChange,
  translationKey,
  step,
  requiresSnapshot,
}: SliderSettingProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [localValue, setLocalValue] = useState<number | string | number[]>(value);

  function valuetext(value: number) {
    return `${value} %`;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (localValue < 0) {
      setLocalValue(50);
    } else if (localValue > 150) {
      setLocalValue(150);
    }
  };

  return (
    <FormControl component="fieldset" className={classes.root}>
      <FormGroup>
        <FormLabel id={`${translationKey}-label`} className={classes.label}>
          {t(`label.${translationKey}`)} {requiresSnapshot ? '*' : ''}
        </FormLabel>
        <Box mt={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <ZoomInIcon />
            </Grid>
            <Grid item xs>
              <Slider
                value={typeof localValue === 'number' ? localValue : 0}
                getAriaValueText={(val) => valuetext(val)}
                aria-labelledby={`${translationKey}-label`}
                step={step}
                min={50}
                max={150}
                onChangeCommitted={(e, v) => {
                  handleChange(e, v);
                }}
                onChange={(_e, v) => {
                  setLocalValue(v);
                }}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item>
              <Input
                className={classes.input}
                value={localValue}
                margin="dense"
                onChange={handleInputChange}
                onBlur={handleBlur}
                inputProps={{
                  step: 10,
                  min: 50,
                  max: 150,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <FormHelperText>{t(`helper_text.${translationKey}`)}</FormHelperText>
      </FormGroup>
    </FormControl>
  );
};

export default SliderSetting;
