import React from 'react';
import { Grid } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import PriceTableContainer from '../../../price-table/PriceTableContainer';
import { UiStateStore } from '../../../../store/uiStateStore';

type CustomPricesSettingsProps = {
  uiStateStore?: UiStateStore;
};

const CustomPricesSettings = ({ uiStateStore }: CustomPricesSettingsProps) =>
  uiStateStore!.initiated && uiStateStore!.validated ? (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <PriceTableContainer />
      </Grid>
    </Grid>
  ) : (
    <>Waiting for response from price source...</>
  );

export default inject('uiStateStore')(observer(CustomPricesSettings));
