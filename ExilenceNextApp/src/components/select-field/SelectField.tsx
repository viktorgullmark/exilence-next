import React, { ReactNode } from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import { useField } from 'formik';

import useLabelWidth from '../../hooks/use-label-width';
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
  const { labelWidth, ref } = useLabelWidth(0);

  const initialOptions = hasPlaceholder
    ? [
        {
          id: '',
          value: placeholderOption,
          label: placeholderOption,
        } as ISelectOption,
      ]
    : [];

  return (
    <FormControl
      variant="outlined"
      error={meta.touched && !!meta.error}
      required={required}
      className={classes.root}
      fullWidth
    >
      <InputLabel ref={ref}>{label}</InputLabel>
      <Select id={name} fullWidth labelWidth={labelWidth} {...field}>
        {options
          ? initialOptions.concat(options).map((opt) => (
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
