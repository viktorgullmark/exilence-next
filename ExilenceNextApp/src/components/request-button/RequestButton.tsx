import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { ButtonProps } from '@mui/material/Button';

import useStyles from './RequestButton.styles';

type RequestButtonProps = ButtonProps & {
  loading: boolean;
};

const RequestButton = ({ loading, children, ...props }: RequestButtonProps) => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Button {...props}>{children}</Button>
      {loading && <CircularProgress className={classes.buttonProgress} size={26} />}
    </div>
  );
};

export default RequestButton;
