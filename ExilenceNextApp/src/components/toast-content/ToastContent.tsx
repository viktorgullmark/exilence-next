import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import useStyles from './ToastContent.styles';

interface Props {
  message: string;
  description: string;
  stackTrace?: string;
}

const ToastContent: React.FC<Props> = ({
  message,
  description,
  stackTrace
}: Props) => {
  const classes = useStyles();

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography component="span" className={classes.message}>
            {message}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography component="span" className={classes.description}>
            {description}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

export default ToastContent;
