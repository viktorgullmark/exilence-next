import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@material-ui/core';
import { useField } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useLabelWidth from '../../hooks/use-label-width';
import VisibilityIcon from '../visibility-icon/VisibilityIcon';
import useStyles from './PasswordField.styles';

interface Props {
  name: string;
  label: string;
  handleOnChange: (e: React.FormEvent<HTMLDivElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  helperText?: string;
  customError?: string;
}

const PasswordField: React.FC<Props> = ({
  name,
  label,
  placeholder,
  required,
  autoFocus,
  helperText,
  customError,
  handleOnChange
}) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [field, meta] = useField(name);
  const [visible, setVisible] = useState(false);
  const { labelWidth, ref } = useLabelWidth(0);

  const handleMouseDownIcon = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <FormControl
      variant="outlined"
      className={classes.root}
      error={meta.touched && (!!meta.error || !!customError)}
      onChange={e => {
        field.onChange(e);
        handleOnChange(e);
      }}
      fullWidth
    >
      <InputLabel ref={ref} htmlFor={name}>
        {label} {!required && `(${t('label.optional').toLowerCase()})`}
      </InputLabel>
      <OutlinedInput
        id={name}
        type={visible ? 'text' : 'password'}
        autoFocus={autoFocus}
        placeholder={placeholder}
        required={required}
        labelWidth={labelWidth}
        endAdornment={
          <VisibilityIcon
            position="end"
            visible={visible}
            handleClickShowIcon={() => setVisible(!visible)}
            handleMouseDownIcon={handleMouseDownIcon}
          />
        }
        {...field}
      />
      {((meta.touched && (meta.error || customError)) || helperText) && (
        <FormHelperText className={classes.helperText}>
          {customError || helperText || meta.error}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default PasswordField;
