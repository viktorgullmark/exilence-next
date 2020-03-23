import {
  FormControl,
  FormGroup,
  FormHelperText,
  FormLabel,
  TextField
} from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './TextInputSetting.styles';

interface Props {
  value: string;
  handleChange: (value: string) => void;
  translationKey: string;
  disabled?: boolean;
}

const TextInputSetting: React.FC<Props> = ({
  value,
  handleChange,
  translationKey,
  disabled
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <FormControl component="fieldset">
      <FormGroup>
        <FormLabel id={`${translationKey}-label`}>
          {t(`label.${translationKey}`)}
        </FormLabel>
        <TextField
          className={classes.root}
          id={`${translationKey}-label`}
          value={value}
          onChange={e => handleChange(e.target.value)}
          disabled={disabled}
        ></TextField>
        <FormHelperText>{t(`helper_text.${translationKey}`)}</FormHelperText>
      </FormGroup>
    </FormControl>
  );
};

export default TextInputSetting;
