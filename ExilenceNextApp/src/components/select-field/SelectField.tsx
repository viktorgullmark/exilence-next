import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import { useField } from 'formik';
import React from 'react';
import { ISelectOption } from '../../interfaces/select-option.interface';
import useLabelWidth from '../../hooks/use-label-width';

interface Props {
  name: string;
  label: string;
  required?: boolean;
  options?: ISelectOption[];
}

const SelectField: React.FC<Props> = ({
  name,
  label,
  options,
  required,
  children
}) => {
  const [field, meta] = useField(name);
  const { labelWidth, ref } = useLabelWidth(0);

  return (
    <FormControl
      variant="outlined"
      error={meta.touched && !!meta.error}
      required={required}
      fullWidth
    >
      <InputLabel ref={ref}>{label}</InputLabel>
      <Select id={name} fullWidth labelWidth={labelWidth} {...field}>
        {options
          ? options.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))
          : children}
      </Select>
      {meta.touched && meta.error && (
        <FormHelperText>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectField;
