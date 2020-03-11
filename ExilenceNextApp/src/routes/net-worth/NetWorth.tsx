import { Grid, useTheme, Box, Typography } from '@material-ui/core';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import UpdateIcon from '@material-ui/icons/Update';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { appName, visitor } from '../..';
import { cardColors, itemColors } from '../../assets/themes/exilence-theme';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import NetWorthTabGroup from '../../components/net-worth-tab-group/NetWorthTabGroup';
import OverviewWidgetContent from '../../components/overview-widget-content/OverviewWidgetContent';
import SnapshotHistoryChartContainer from '../../components/snapshot-history-chart/SnapshotHistoryChartContainer';
import Widget from '../../components/widget/Widget';
import { AccountStore } from '../../store/accountStore';
import { SignalrStore } from '../../store/signalrStore';
import { UiStateStore } from '../../store/uiStateStore';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useStyles } from './NetWorth.styles';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from '../../components/expansion-panel/ExpansionPanel';
import ItemTableContainer from '../../components/item-table/ItemTableContainer';
import { openLink } from '../../utils/window.utils';

interface NetWorthProps {
  accountStore?: AccountStore;
  signalrStore?: SignalrStore;
  uiStateStore?: UiStateStore;
}

export const netWorthGridSpacing = 2;
export const cardHeight = 100;
export const chartHeight = 240;

const NetWorth: React.FC<NetWorthProps> = ({
  accountStore,
  signalrStore,
  uiStateStore
}: NetWorthProps) => {
  const theme = useTheme();
  const activeProfile = accountStore!.getSelectedAccount.activeProfile;
  const { activeGroup } = signalrStore!;
  const { t } = useTranslation();
  const classes = useStyles();

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
    if (
      !uiStateStore!.validated &&
      !uiStateStore!.initiated &&
      !uiStateStore!.isValidating
    ) {
      accountStore!.validateSession('/net-worth');
    }

    visitor!.pageview('/net-worth', appName).send();
  }, []);

  return (
    <FeatureWrapper>
      <Grid container spacing={netWorthGridSpacing}>
        <Grid item xs={6} md={3} lg={3} xl={2}>
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
        <Grid item xs={6} md={3} lg={3} xl={2}>
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
        <Grid item xs={6} md={3} lg={3} xl={2}>
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
        <Grid item xs={12}>
          <ExpansionPanel
            expanded={uiStateStore!.netWorthChartExpanded}
            onChange={() =>
              uiStateStore!.setNetWorthChartExpanded(
                !uiStateStore!.netWorthChartExpanded
              )
            }
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{t('label.net_worth_chart')}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              style={{
                height: chartHeight,
                background: theme.palette.background.default
              }}
            >
              <SnapshotHistoryChartContainer />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
        <Grid item xs={12} style={{ paddingBottom: 0 }}>
          <ExpansionPanel
            expanded={uiStateStore!.netWorthItemsExpanded}
            onChange={() =>
              uiStateStore!.setNetWorthItemsExpanded(
                !uiStateStore!.netWorthItemsExpanded
              )
            }
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Grid container justify="space-between">
                <Grid item>
                  <Typography>{t('label.item_table')}</Typography>
                </Grid>
                <Grid item className={classes.secondaryHeader}>
                  <Typography className={classes.creditText}>
                    {t('label.prices_fetched_from')}
                    <a
                      className={classes.inlineLink}
                      href="https://poe.ninja"
                      onClick={e => openLink(e)}
                    >
                      https://poe.ninja
                    </a>
                  </Typography>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              style={{
                background: theme.palette.background.default,
                display: 'block'
              }}
            >
              <ItemTableContainer />
            </ExpansionPanelDetails>
          </ExpansionPanel>
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
