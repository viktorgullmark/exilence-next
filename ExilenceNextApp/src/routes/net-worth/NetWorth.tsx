import { Grid } from '@material-ui/core';
import React from 'react';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import Widget from '../../components/widget/Widget';
import { AccountStore } from '../../store/accountStore';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';

interface NetWorthProps {
  accountStore?: AccountStore;
}

const NetWorth: React.FC<NetWorthProps> = ({ accountStore }: NetWorthProps) => {

  accountStore!.updateAccountData();

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

export default inject('accountStore')(observer(NetWorth));
