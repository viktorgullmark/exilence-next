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

  const handleChange = (event: any, checked: boolean) => {
    console.log('---> event.target.checked', event.target.checked);
    console.log('---> checked', checked);
    field.onChange(event);
  };

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
            onChange={handleChange} // temporary
          />
        }
        label={label}
      />
    </FormControl>
  );
};

export default CheckboxField;
