import { Grid, useTheme } from '@material-ui/core';
import GavelIcon from '@material-ui/icons/Gavel';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import UpdateIcon from '@material-ui/icons/Update';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { appName, visitor } from '../..';
import { cardColors, itemColors } from '../../assets/themes/exilence-theme';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import NetWorthTabGroup from '../../components/net-worth-tab-group/NetWorthTabGroup';
import OverviewWidgetContent from '../../components/overview-widget-content/OverviewWidgetContent';
import Widget from '../../components/widget/Widget';
import { AccountStore } from '../../store/accountStore';
import { SignalrStore } from '../../store/signalrStore';
import { UiStateStore } from '../../store/uiStateStore';
import SnapshotHistoryChartContainer from '../../components/snapshot-history-chart/SnapshotHistoryChartContainer';

interface NetWorthProps {
  accountStore?: AccountStore;
  signalrStore?: SignalrStore;
  uiStateStore?: UiStateStore;
}

export const netWorthGridSpacing = 3;
export const cardHeight = 100;
export const chartHeight = 200;

const NetWorth: React.FC<NetWorthProps> = ({
  accountStore,
  signalrStore,
  uiStateStore
}: NetWorthProps) => {
  const location = useLocation();
  const theme = useTheme();
  const activeProfile = accountStore!.getSelectedAccount.activeProfile;

  const itemCount = () => {
    return activeProfile ? activeProfile.itemCount : 0;
  };

  const netWorthValue = () => {
    return activeProfile ? activeProfile.netWorthValue : 0;
  };

  const snapshots = () => {
    return activeProfile ? activeProfile.snapshots : [];
  };

  const activeCurrency = () => {
    return activeProfile
      ? activeProfile.activeCurrency
      : { name: 'chaos', short: 'c' };
  };

  const { activeGroup } = signalrStore!;

  useEffect(() => {
    if (!uiStateStore!.validated && !uiStateStore!.initiated) {
      accountStore!.validateSession('/net-worth');
    }

    visitor!.pageview('/net-worth', appName).send();
  });

  return (
    <FeatureWrapper>
      <Grid container spacing={netWorthGridSpacing}>
        <Grid item xs={6} md={3} lg={3}>
          <Widget backgroundColor={cardColors.primary}>
            <OverviewWidgetContent
              value={activeGroup ? activeGroup.netWorthValue : netWorthValue()}
              title="label.total_value"
              valueColor={itemColors.chaosOrb}
              currencyShort={activeCurrency().short}
              icon={<MonetizationOnIcon fontSize="large" />}
              currency
            />
          </Widget>
        </Grid>
        <Grid item xs={6} md={3} lg={3}>
          <Widget backgroundColor={cardColors.secondary}>
            <OverviewWidgetContent
              value={activeGroup ? activeGroup.itemCount : itemCount()}
              title="label.total_items"
              valueColor={theme.palette.text.primary}
              icon={<GavelIcon fontSize="large" />}
            />
          </Widget>
        </Grid>
        <Grid item xs={6} md={3} lg={3}>
          <Widget backgroundColor={cardColors.third}>
            <OverviewWidgetContent
              value={
                activeGroup
                  ? activeGroup.groupSnapshots.length
                  : snapshots().length
              }
              title="label.total_snapshots"
              valueColor={theme.palette.text.primary}
              icon={<UpdateIcon fontSize="large" />}
            />
          </Widget>
        </Grid>
        <Grid item xs={6} md={3} lg={3}>
          <Widget backgroundColor={theme.palette.background.default} compact>
            <SnapshotHistoryChartContainer />
          </Widget>
        </Grid>
        <Grid item xs={12}>
          <NetWorthTabGroup />
        </Grid>
      </Grid>
    </FeatureWrapper>
  );
};

export default inject(
  'accountStore',
  'signalrStore',
  'uiStateStore'
)(observer(NetWorth));
