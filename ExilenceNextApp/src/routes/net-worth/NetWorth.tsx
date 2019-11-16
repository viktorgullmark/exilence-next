import { Grid } from '@material-ui/core';
import React from 'react';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import Widget from '../../components/widget/Widget';
import { AccountStore } from '../../store/accountStore';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import { UiStateStore } from '../../store/uiStateStore';

interface NetWorthProps {
  accountStore?: AccountStore;
  uiStateStore?: UiStateStore;
}

const NetWorth: React.FC<NetWorthProps> = ({
  accountStore,
  uiStateStore
}: NetWorthProps) => {

  if (!uiStateStore!.validated) {
    accountStore!.initSession();
  }

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

export default inject('accountStore', 'uiStateStore')(observer(NetWorth));
