import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { useField } from 'formik';
import React, { ReactNode } from 'react';
import { ISelectOption } from '../../interfaces/select-option.interface';
import { placeholderOption } from '../../utils/misc.utils';
import useStyles from './SelectField.styles';

type SelectFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  hasPlaceholder?: boolean;
  options?: ISelectOption[];
  children?: ReactNode;
};

const SelectField = ({
  name,
  label,
  options,
  required,
  hasPlaceholder,
  children,
}: SelectFieldProps) => {
  const classes = useStyles();
  const [field, meta] = useField(name);

  const initialOptions = hasPlaceholder
    ? [
        {
          id: '',
          value: placeholderOption,
          label: placeholderOption,
        } as ISelectOption,
      ]
    : [];

  const combinedOptions = options ? initialOptions.concat(options) : initialOptions;

  return (
    <FormControl
      variant="outlined"
      error={meta.touched && !!meta.error}
      required={required}
      className={classes.root}
      fullWidth
    >
      <InputLabel>{label}</InputLabel>
      <Select
        id={name}
        fullWidth
        label={label}
        {...field}
        defaultValue={hasPlaceholder ? placeholderOption : undefined}
      >
        {options
          ? combinedOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))
          : children}
      </Select>
      {meta.touched && meta.error && <FormHelperText>{meta.error}</FormHelperText>}
    </FormControl>
  );
};

export default SelectField;
