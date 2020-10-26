import React from 'react';
import { Grid } from '@material-ui/core';
import { observer } from 'mobx-react';
import PriceTableContainer from '../../price-table/PriceTableContainer';

const CustomPricesSettings = () => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <PriceTableContainer />
    </Grid>
  </Grid>
);

export default observer(CustomPricesSettings);
