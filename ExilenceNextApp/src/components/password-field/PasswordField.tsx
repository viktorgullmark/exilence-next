import {
  FormControl,
  FormHelperText,
  InputLabel,
  makeStyles,
  OutlinedInput
} from '@material-ui/core';
import { useField } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import VisibilityIcon from '../visibility-icon/VisibilityIcon';
import useLabelWidth from '../../hooks/use-label-width';

interface Props {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  helperText?: string;
}

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2)
  },
  helperText: {
    fontSize: '0.75rem',
    lineHeight: '1.2em'
  }
}));

const PasswordField: React.FC<Props> = ({
  name,
  label,
  placeholder,
  required,
  autoFocus,
  helperText
}) => {
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
      error={meta.touched && !!meta.error}
      fullWidth
    >
      <InputLabel ref={ref} htmlFor={name}>
        {label}
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
      {((meta.touched && meta.error) || helperText) && (
        <FormHelperText className={classes.helperText}>
          {helperText || meta.error}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default PasswordField;
