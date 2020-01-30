import { Button, CircularProgress } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import React from 'react';
import useStyles from './RequestButton.styles';

type Props = ButtonProps & {
  loading: boolean;
};

const RequestButton: React.FC<Props> = ({ loading, children, ...props }) => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <Button {...props}>{children}</Button>
      {loading && (
        <CircularProgress className={classes.buttonProgress} size={26} />
      )}
    </div>
  );
};

export default RequestButton;
