import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { toolbarHeight } from '../../components/header/Header';
import { resizeHandleContainerHeight } from './../../components/header/Header';

const useStyles = makeStyles(theme => ({
  featureWrapper: {
    height: '100%',
    display: 'flex',
    margin: `calc(${toolbarHeight}px + ${resizeHandleContainerHeight}px + ${theme.spacing(2)}px) 
    ${theme.spacing(2)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`
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
