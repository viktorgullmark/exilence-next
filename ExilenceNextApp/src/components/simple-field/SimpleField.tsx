import React, { ReactElement } from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

import useStyles from './SimpleField.styles';

type SimpleFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  autoFocus?: boolean;
  type?: 'text' | 'number';
  placeholder?: string;
  endIcon?: ReactElement;
  customError?: string;
  handleBlur?: (value: string) => void;
};

const SimpleField = ({
  name,
  label,
  placeholder,
  type,
  required,
  autoFocus,
  endIcon,
  customError,
  handleBlur,
}: SimpleFieldProps) => {
  const classes = useStyles();
  const [field, meta] = useField(name);

  return (
    <TextField
      {...field}
      id={name}
      margin="normal"
      type={type}
      label={label}
      variant="outlined"
      placeholder={placeholder}
      autoFocus={autoFocus}
      error={meta.touched && (!!meta.error || !!customError)}
      helperText={meta.touched && (meta.error || customError)}
      required={required}
      className={classes.root}
      InputProps={{ endAdornment: endIcon }}
      fullWidth
      onBlur={(e) => {
        field.onBlur(e);
        if (handleBlur) {
          handleBlur(field.value);
        }
      }}
    />
  );
};

export default SimpleField;
