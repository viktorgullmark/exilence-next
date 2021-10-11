import React from 'react';
import { Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { useField } from 'formik';

interface Props {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

const CheckboxField = ({ name, label, required, disabled }: Props) => {
  const [field, meta] = useField({ name, type: 'checkbox' });

  return (
    <FormControl
      id={name}
      error={meta.touched && !!meta.error}
      required={required}
      disabled={disabled}
      fullWidth
    >
      <FormControlLabel
        checked={field.checked}
        {...field}
        control={
          <Checkbox
            checked={field.checked}
            color="primary"
            value={name}
            onChange={field.onChange}
          />
        }
        label={label}
      />
    </FormControl>
  );
};

export default CheckboxField;
