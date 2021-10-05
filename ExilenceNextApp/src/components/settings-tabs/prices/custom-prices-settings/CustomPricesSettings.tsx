import { Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../../../..';
import PriceTableContainer from '../../../price-table/PriceTableContainer';

const CustomPricesSettings = () => {
  const { uiStateStore } = useStores();
  return (
    <>
      {uiStateStore.initiated && uiStateStore!.validated ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <PriceTableContainer />
          </Grid>
        </Grid>
      ) : (
        <>Waiting for response from price source...</>
      )}
    </>
  );
};

export default observer(CustomPricesSettings);
