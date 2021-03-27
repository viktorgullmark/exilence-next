import React, { ReactNode } from 'react';
import { observer } from 'mobx-react-lite';

import useStyles from './FeatureWrapper.styles';

type FeatureWrapperProps = {
  children: ReactNode;
};

const FeatureWrapper = ({ children }: FeatureWrapperProps) => {
  const classes = useStyles();

  return <div className={classes.Wrapper}>{children}</div>;
};

export default observer(FeatureWrapper);
