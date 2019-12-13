import { Grid, useTheme } from '@material-ui/core';
import blueGrey from '@material-ui/core/colors/blueGrey';
import GavelIcon from '@material-ui/icons/Gavel';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import UpdateIcon from '@material-ui/icons/Update';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { itemColors, cardColors } from '../../assets/themes/exilence-theme';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import NetWorthTabGroup from '../../components/net-worth-tab-group/NetWorthTabGroup';
import OverviewWidgetContent from '../../components/overview-widget-content/OverviewWidgetContent';
import Widget from '../../components/widget/Widget';
import { AccountStore } from '../../store/accountStore';
import { UiStateStore } from '../../store/uiStateStore';
import { visitor, appName } from '../..';

interface NetWorthProps {
  accountStore?: AccountStore;
  uiStateStore?: UiStateStore;
}

export const netWorthGridSpacing = 3;

const NetWorth: React.FC<NetWorthProps> = ({
  accountStore,
  uiStateStore
}: NetWorthProps) => {

  const theme = useTheme();

  useEffect(() => {
    if (!uiStateStore!.validated && !uiStateStore!.initated) {
      accountStore!.initSession();
    }

    visitor.pageview('Net worth screen', appName).send();
  })

  return (
    <FeatureWrapper>
      <Grid container spacing={netWorthGridSpacing}>
        <Grid item xs={6} md={4} lg={3}>
          <Widget backgroundColor={cardColors.primary}>
            <OverviewWidgetContent
              value={
                accountStore!.getSelectedAccount.activeProfile
                  .latestSnapshotValue
              }
              title="label.total_value"
              valueColor={itemColors.chaosOrb}
              currencyShort={
                accountStore!.getSelectedAccount.activeProfile.activeCurrency
                  .short
              }
              icon={<MonetizationOnIcon fontSize="large" />}
              currency
            />
          </Widget>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Widget backgroundColor={cardColors.secondary}>
            <OverviewWidgetContent
              value={
                accountStore!.getSelectedAccount.activeProfile
                  .latestSnapshotItemCount
              }
              title="label.total_items"
              valueColor={theme.palette.text.primary}
              icon={<GavelIcon fontSize="large" />}
            />
          </Widget>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Widget backgroundColor={cardColors.third}>
            <OverviewWidgetContent
              value={
                accountStore!.getSelectedAccount.activeProfile.snapshots.length
              }
              title="label.total_snapshots"
              valueColor={theme.palette.text.primary}
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
