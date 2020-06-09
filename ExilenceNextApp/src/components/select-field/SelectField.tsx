import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import { useField } from 'formik';
import React from 'react';
import useLabelWidth from '../../hooks/use-label-width';
import { ISelectOption } from '../../interfaces/select-option.interface';
import { placeholderOption } from '../../utils/misc.utils';
import useStyles from './SelectField.styles';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
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
  children,
}) => {
  const classes = useStyles();
  const [field, meta] = useField(name);
  const { labelWidth, ref } = useLabelWidth(0);

  return (
    <FormControl
      variant='outlined'
      error={meta.touched && !!meta.error}
      required={required}
      className={classes.root}
      fullWidth
    >
      <InputLabel ref={ref}>{label}</InputLabel>
      <Select id={name} fullWidth labelWidth={labelWidth} {...field}>
        {options
          ? [
              {
                id: '',
                value: placeholderOption,
                label: placeholderOption,
              } as ISelectOption,
            ]
              .concat(options)
              .map((opt) => (
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
