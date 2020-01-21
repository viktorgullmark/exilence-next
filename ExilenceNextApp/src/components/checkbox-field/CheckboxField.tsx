import { Checkbox, FormControlLabel, FormControl } from '@material-ui/core';
import { useField } from 'formik';
import React from 'react';

interface Props {
  name: string;
  label: string;
  required?: boolean;
}

const CheckboxField = ({ name, label, required }: Props) => {
  const [field, meta] = useField(name);

  return (
    <FormControl
      id={name}
      error={meta.touched && !!meta.error}
      required={required}
      fullWidth
    >
      <FormControlLabel
        checked
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
