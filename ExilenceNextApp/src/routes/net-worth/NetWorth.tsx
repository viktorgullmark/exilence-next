import { Grid } from '@material-ui/core';
import React from 'react';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import Widget from '../../components/widget/Widget';

const NetWorth: React.FC = (props: any) => {
  return (
    <FeatureWrapper>
      <Grid container spacing={3}>
        <Grid item sm={12} xs={12}>
          <Widget>profile widget</Widget>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Widget>networth stats</Widget>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Widget>networth actions</Widget>
        </Grid>
      </Grid>
    </FeatureWrapper>
  );
};

export default NetWorth;
