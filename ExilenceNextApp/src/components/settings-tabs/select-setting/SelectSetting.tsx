import {
  createStyles,
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  makeStyles,
  MenuItem,
  Select
} from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ISelectOption } from '../../../interfaces/select-option.interface';

interface Props {
  value: number;
  options: ISelectOption[];
  handleChange: (value: number) => void;
  translationKey: string;
}

const useStyles = makeStyles(theme =>
  createStyles({
    label: {
      '& + .MuiInput-formControl': {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
      }
    }
  })
);

const SelectSetting: React.FC<Props> = ({
  value,
  options,
  handleChange,
  translationKey
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <FormControl component="fieldset">
      <FormGroup>
        <FormLabel id={`${translationKey}-label`} className={classes.label}>
          {t(`label.${translationKey}`)}
        </FormLabel>
        <Select
          labelId="price-treshold-label"
          id="price-treshold"
          value={value}
          onChange={e => handleChange(e.target.value as number)}
          displayEmpty
        >
          <MenuItem value={0}>
            <em>{t('value.none')}</em>
          </MenuItem>
          {options.map(option => {
            return (
              <MenuItem key={option.id} value={option.value}>
                {option.label ? option.label : option.value}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>{t(`helper_text.${translationKey}`)}</FormHelperText>
      </FormGroup>
    </FormControl>
  );
};

export default SelectSetting;
