import { TextField, makeStyles, Theme } from '@material-ui/core';
import { useField } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  name: string;
  label: string;
  required?: boolean;
  autoFocus?: boolean;
  type?: 'text' | 'number';
  placeholder?: string;
  endIcon?: JSX.Element;
  customError?: string;
  handleBlur?: (value: string) => void;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginBottom: theme.spacing(2)
  }
}));

const SimpleField: React.FC<Props> = ({
  name,
  label,
  placeholder,
  type,
  required,
  autoFocus,
  endIcon,
  customError,
  handleBlur
}) => {
  const { t } = useTranslation();
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
      onBlur={e => {
        field.onBlur(e);
        if (handleBlur) {
          handleBlur(field.value);
        }
      }}
    />
  );
};

export default SimpleField;
