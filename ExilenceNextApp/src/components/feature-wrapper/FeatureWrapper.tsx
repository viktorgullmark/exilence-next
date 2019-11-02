import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import React from 'react';

const useStyles = makeStyles(theme => ({
  Wrapper: {
    display: 'flex',
    margin: theme.spacing(1)
  }
}));

interface FeatureWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

const FeatureWrapper: React.FC<FeatureWrapperProps> = ({
  children
}: FeatureWrapperProps) => {
  const classes = useStyles();

  return <div className={classes.Wrapper}>{children}</div>;
};

export default observer(FeatureWrapper);
