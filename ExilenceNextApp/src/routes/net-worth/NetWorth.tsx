import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(theme => ({
  featureWrapper: {
    height: '100%',
    display: 'flex'
  }
}));

const NetWorth: React.FC = (props: any) => {
  const classes = useStyles();

  return (
    <div className={classes.featureWrapper}>
      <h3>Net worth area</h3>
    </div>
  );
};

export default NetWorth;
