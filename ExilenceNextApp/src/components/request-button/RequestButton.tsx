import { Button, CircularProgress, makeStyles, Theme } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button';
import React from 'react';

type Props = ButtonProps & {
  loading: boolean;
};

const useStyles = makeStyles((theme: Theme) => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  wrapper: {
    position: 'relative'
  }
}));

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
