import { Grid } from '@material-ui/core';
import React from 'react';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import Widget from '../../components/widget/Widget';

const NetWorth: React.FC = (props: any) => {
  return (
    <FeatureWrapper>
      <Grid container spacing={3}>
        <Grid item sm={3} xs={6}>
          <Widget>card 1</Widget>
        </Grid>
        <Grid item sm={3} xs={6}>
          <Widget>card 2</Widget>
        </Grid>
      </Grid>
    </FeatureWrapper>
  );
};

export default NetWorth;
