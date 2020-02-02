import { Box, Grid, makeStyles, Theme, useTheme } from '@material-ui/core';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import UpdateIcon from '@material-ui/icons/Update';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { appName, visitor } from '../..';
import DiscordLogo from '../../assets/img/discord-wordmark-colored.svg';
import PatreonLogo from '../../assets/img/patreon-white.png';
import { cardColors, itemColors } from '../../assets/themes/exilence-theme';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import NetWorthTabGroup from '../../components/net-worth-tab-group/NetWorthTabGroup';
import OverviewWidgetContent from '../../components/overview-widget-content/OverviewWidgetContent';
import SnapshotHistoryChartContainer from '../../components/snapshot-history-chart/SnapshotHistoryChartContainer';
import Widget from '../../components/widget/Widget';
import { AccountStore } from '../../store/accountStore';
import { SignalrStore } from '../../store/signalrStore';
import { UiStateStore } from '../../store/uiStateStore';
import { openLink } from '../../utils/window.utils';
import moment from 'moment';

interface NetWorthProps {
  accountStore?: AccountStore;
  signalrStore?: SignalrStore;
  uiStateStore?: UiStateStore;
}

export const netWorthGridSpacing = 2;
export const cardHeight = 100;
export const chartHeight = 240;
const discordLogoHeight = 35;
const patreonLogoHeight = 55;

const useStyles = makeStyles((theme: Theme) => ({
  discordLogo: {
    marginLeft: 5,
    height: discordLogoHeight,
    maxWidth: '100%'
  },
  patreonLogo: {
    maxHeight: patreonLogoHeight,
    maxWidth: '100%'
  }
}));

const NetWorth: React.FC<NetWorthProps> = ({
  accountStore,
  signalrStore,
  uiStateStore
}: NetWorthProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const activeProfile = accountStore!.getSelectedAccount.activeProfile;
  const { activeGroup } = signalrStore!;
  const { t } = useTranslation();

  const updateTimeLabel = () => {
    let timeLabel: string | undefined;
    if (activeGroup) {
      timeLabel = activeGroup?.timeSinceLastSnapshot;
    } else {
      timeLabel = activeProfile?.timeSinceLastSnapshot;
    }
    uiStateStore!.setTimeSinceLastSnapshotLabel(timeLabel);
  };

  useEffect(() => {
    updateTimeLabel();
    const t = setInterval(() => {
      updateTimeLabel();
    }, 1000);
    return () => clearInterval(t);
  }, [activeGroup, activeProfile]);

  const income = () => {
    return activeProfile ? activeProfile.income : 0;
  };

  const netWorthValue = () => {
    return activeProfile ? activeProfile.netWorthValue : 0;
  };

  const lastSnapshotChange = () => {
    return activeProfile ? activeProfile.lastSnapshotChange : 0;
  };

  const snapshots = () => {
    return activeProfile ? activeProfile.snapshots : [];
  };

  const activeCurrency = () => {
    return activeProfile
      ? activeProfile.activeCurrency
      : { name: 'chaos', short: 'c' };
  };

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
              secondaryValue={
                activeGroup
                  ? activeGroup.lastSnapshotChange
                  : lastSnapshotChange()
              }
              secondaryValueIsDiff
              secondaryValueStyles={{ fontSize: '0.8rem' }}
              title="label.total_value"
              valueColor={itemColors.chaosOrb}
              currencyShort={activeCurrency().short}
              icon={<MonetizationOnIcon fontSize="default" />}
              currency
              tooltip="Change in value between the two latest snapshots"
            />
          </Widget>
        </Grid>
        <Grid item xs={6} md={3} lg={3}>
          <Widget backgroundColor={cardColors.secondary}>
            <OverviewWidgetContent
              value={activeGroup ? activeGroup.income : income()}
              valueIsDiff
              valueSuffix={` ${t('label.hour_suffix')}`}
              title="label.total_income"
              valueColor={itemColors.chaosOrb}
              icon={<TrendingUpIcon fontSize="default" />}
              currencyShort={activeCurrency().short}
              currency
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
              secondaryValue={uiStateStore!.timeSinceLastSnapshotLabel}
              secondaryValueStyles={{
                color: theme.palette.text.primary,
                fontSize: '0.8rem',
                fontWeight: 'normal'
              }}
              valueColor={theme.palette.text.primary}
              icon={<UpdateIcon fontSize="default" />}
              tooltip="Time since last snapshot"
            />
          </Widget>
        </Grid>
        <Grid item xs={6} md={3} lg={3}>
          <Widget>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              height={1}
            >
              <a href="https://patreon.com/exilence" onClick={e => openLink(e)}>
                <Box display="flex" alignItems="center" height={1}>
                  <img className={classes.patreonLogo} src={PatreonLogo} />
                </Box>
              </a>
              <a href="https://discord.gg/yxuBrPY" onClick={e => openLink(e)}>
                <Box display="flex" alignItems="center" height={1}>
                  <img className={classes.discordLogo} src={DiscordLogo} />
                </Box>
              </a>
            </Box>
          </Widget>
        </Grid>
        <Grid item xs={12}>
          <Widget height={chartHeight}>
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
