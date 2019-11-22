import { Grid } from '@material-ui/core';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import NetWorthTabGroup from '../../components/net-worth-tab-group/NetWorthTabGroup';
import Widget from '../../components/widget/Widget';
import { AccountStore } from '../../store/accountStore';
import { UiStateStore } from '../../store/uiStateStore';

interface NetWorthProps {
  accountStore?: AccountStore;
  uiStateStore?: UiStateStore;
}

export const netWorthGridSpacing = 3;

const NetWorth: React.FC<NetWorthProps> = ({
  accountStore,
  uiStateStore
}: NetWorthProps) => {
  if (!uiStateStore!.validated) {
    accountStore!.initSession();
  }

  return (
    <FeatureWrapper>
      <Grid container spacing={netWorthGridSpacing}>
        <Grid item sm={3} xs={6}>
          <Widget>card 1</Widget>
        </Grid>
        <Grid item sm={3} xs={6}>
          <Widget>card 2</Widget>
        </Grid>
        <Grid item xs={12}>
          <NetWorthTabGroup />
        </Grid>
      </Grid>
    </FeatureWrapper>
  );
};

export default inject('accountStore', 'uiStateStore')(observer(NetWorth));
