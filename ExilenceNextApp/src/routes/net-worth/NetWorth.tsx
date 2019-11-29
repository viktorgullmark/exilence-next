import { Grid, useTheme } from '@material-ui/core';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import GavelIcon from '@material-ui/icons/Gavel';
import UpdateIcon from '@material-ui/icons/Update';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React from 'react';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import NetWorthTabGroup from '../../components/net-worth-tab-group/NetWorthTabGroup';
import OverviewWidgetContent from '../../components/overview-widget-content/OverviewWidgetContent';
import Widget from '../../components/widget/Widget';
import { AccountStore } from '../../store/accountStore';
import { UiStateStore } from '../../store/uiStateStore';
import teal from '@material-ui/core/colors/teal';
import orange from '@material-ui/core/colors/orange';
import blueGrey from '@material-ui/core/colors/blueGrey';
import cyan from '@material-ui/core/colors/cyan';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { primaryDarker, cardColor, itemColors } from '../../assets/themes/exilence-theme';

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

  const theme = useTheme();

  return (
    <FeatureWrapper>
      <Grid container spacing={netWorthGridSpacing}>
        <Grid item xs={6} md={4} lg={3}>
          <Widget backgroundColor={blueGrey[900]}>
            <OverviewWidgetContent
              value={accountStore!.getSelectedAccount.activeProfile.latestSnapshotValue}
              title="label.total_value"
              valueColor={itemColors.chaosOrb}
              currencyShort={accountStore!.getSelectedAccount.activeProfile.activeCurrency.short}
              icon={<MonetizationOnIcon fontSize="large" />}
              currency
            />
          </Widget>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Widget backgroundColor={blueGrey[900]}>
            <OverviewWidgetContent
              value={accountStore!.getSelectedAccount.activeProfile.latestSnapshotItemCount}
              title="label.total_items"
              icon={<GavelIcon fontSize="large" />}
            />
          </Widget>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Widget backgroundColor={blueGrey[900]}>
            <OverviewWidgetContent
              value={accountStore!.getSelectedAccount.activeProfile.snapshots.length}
              title="label.total_snapshots"
              icon={<UpdateIcon fontSize="large" />}
            />
          </Widget>
        </Grid>
        <Grid item xs={12}>
          <NetWorthTabGroup />
        </Grid>
      </Grid>
    </FeatureWrapper>
  );
};

export default inject('accountStore', 'uiStateStore')(observer(NetWorth));
