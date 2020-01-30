import { observer } from 'mobx-react';
import React from 'react';
import useStyles from './FeatureWrapper.styles';

interface FeatureWrapperProps extends React.HTMLAttributes<HTMLDivElement> {}

const FeatureWrapper: React.FC<FeatureWrapperProps> = ({
  children
}: FeatureWrapperProps) => {
  const classes = useStyles();

  return <div className={classes.Wrapper}>{children}</div>;
};

export default observer(FeatureWrapper);
