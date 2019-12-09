import React from 'react';
import { Grid, Typography, makeStyles, Theme } from '@material-ui/core';

interface Props {
  message: string;
  description: string;
  stackTrace?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  message: {
  },
  description: {
    color: theme.palette.primary.contrastText,
    fontSize: '0.75rem'
  }
}));

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
