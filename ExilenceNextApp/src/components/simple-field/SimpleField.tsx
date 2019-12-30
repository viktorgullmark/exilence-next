import { TextField } from '@material-ui/core';
import { useField } from 'formik';
import React from 'react';

interface Props {
  name: string;
  label: string;
  required?: boolean;
  autoFocus?: boolean;
  type?: 'text' | 'number';
  placeholder?: string;
}

const SimpleField: React.FC<Props> = ({
  name,
  label,
  placeholder,
  type,
  required,
  autoFocus
}) => {
  const [field, meta] = useField(name);

  return (
    <TextField
      id={name}
      type={type}
      label={label}
      variant="outlined"
      placeholder={placeholder}
      autoFocus={autoFocus}
      error={meta.touched && !!meta.error}
      helperText={meta.touched && meta.error}
      required={required}
      fullWidth
      {...field}
    />
  );
};

export default SimpleField;
