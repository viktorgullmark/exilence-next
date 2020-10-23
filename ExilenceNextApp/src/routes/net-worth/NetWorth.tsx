import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Tooltip, Typography, useTheme } from '@material-ui/core';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListIcon from '@material-ui/icons/List';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import UpdateIcon from '@material-ui/icons/Update';
import { inject } from 'mobx-react';
import { observer } from 'mobx-react-lite';

import { appName, visitor } from '../..';
import { itemColors } from '../../assets/themes/exilence-theme';
import ChartToolboxContainer from '../../components/chart-toolbox/ChartToolboxContainer';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '../../components/expansion-panel/ExpansionPanel';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import ItemTableFilterSection from '../../components/item-table/item-table-filter-section/ItemTableFilterSection';
import ItemTableContainer from '../../components/item-table/ItemTableContainer';
import OverviewWidgetContent from '../../components/overview-widget-content/OverviewWidgetContent';
import SnapshotHistoryChartContainer from '../../components/snapshot-history-chart/SnapshotHistoryChartContainer';
import Widget from '../../components/widget/Widget';
import { AccountStore } from '../../store/accountStore';
import { SignalrStore } from '../../store/signalrStore';
import { UiStateStore } from '../../store/uiStateStore';
import { getSnapshotCardValue } from '../../utils/snapshot.utils';
import { openLink } from '../../utils/window.utils';
import { useStyles } from './NetWorth.styles';

type NetWorthProps = {
  accountStore?: AccountStore;
  signalrStore?: SignalrStore;
  uiStateStore?: UiStateStore;
};

export const netWorthGridSpacing = 2;
export const cardHeight = 100;
export const chartHeight = 240;

const NetWorth = ({ accountStore, signalrStore, uiStateStore }: NetWorthProps) => {
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
    return activeProfile ? activeProfile.activeCurrency : { name: 'chaos', short: 'c' };
  };

  useEffect(() => {
    if (!uiStateStore!.validated && !uiStateStore!.initiated && !uiStateStore!.isValidating) {
      accountStore!.validateSession('/net-worth');
    }

    visitor!.pageview('/net-worth', appName).send();
  }, []);

  return (
    <FeatureWrapper>
      <Grid container spacing={netWorthGridSpacing}>
        <Grid item xs={6} md={3} lg={3} xl={2}>
          <Widget backgroundColor={theme.palette.secondary.main}>
            <OverviewWidgetContent
              value={activeGroup ? activeGroup.netWorthValue : netWorthValue()}
              secondaryValue={activeGroup ? activeGroup.lastSnapshotChange : lastSnapshotChange()}
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
          <Widget backgroundColor={theme.palette.secondary.main}>
            <OverviewWidgetContent
              value={activeGroup ? activeGroup.income : income()}
              valueIsDiff
              valueSuffix={` ${t('label.hour_suffix')}`}
              title="label.total_income"
              valueColor={itemColors.chaosOrb}
              icon={<TrendingUpIcon fontSize="default" />}
              currencyShort={activeCurrency().short}
              currency
              clearFn={activeGroup ? undefined : () => activeProfile?.clearIncome()}
            />
          </Widget>
        </Grid>
        <Grid item xs={6} md={3} lg={3} xl={2}>
          <Widget backgroundColor={theme.palette.secondary.main}>
            <OverviewWidgetContent
              value={getSnapshotCardValue(
                activeGroup ? activeGroup.groupSnapshots.length : snapshots().length
              )}
              title="label.total_snapshots"
              secondaryValue={uiStateStore!.timeSinceLastSnapshotLabel}
              secondaryValueStyles={{
                color: theme.palette.text.primary,
                fontSize: '0.8rem',
                fontWeight: 'normal',
              }}
              valueColor={theme.palette.text.primary}
              icon={<UpdateIcon fontSize="default" />}
              tooltip="Time since last snapshot"
            />
          </Widget>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              {/* todo: this block should be refactored to its own component */}
              <ExpansionPanel
                expanded={uiStateStore!.netWorthChartExpanded}
                onChange={() =>
                  uiStateStore!.setNetWorthChartExpanded(!uiStateStore!.netWorthChartExpanded)
                }
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <EqualizerIcon fontSize="small" />
                    <Box ml={1}>
                      <Typography variant="overline">{t('label.net_worth_chart')}</Typography>
                    </Box>
                  </Box>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                  style={{
                    height: chartHeight,
                    background: theme.palette.background.default,
                  }}
                >
                  <Grid container>
                    <Grid item xs={12}>
                      <SnapshotHistoryChartContainer />
                    </Grid>
                    <Grid item xs={12}>
                      <ChartToolboxContainer />
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
            <Grid item xs={5}>
              <ExpansionPanel
                expanded={uiStateStore!.tabChartExpanded}
                onChange={() => uiStateStore!.setTabChartExpanded(!uiStateStore!.tabChartExpanded)}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <EqualizerIcon fontSize="small" />
                    <Box ml={1}>
                      <Typography variant="overline">{t('label.tab_chart')}</Typography>
                    </Box>
                  </Box>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails
                  style={{
                    height: chartHeight,
                    background: theme.palette.background.default,
                  }}
                >
                  <Grid container>
                    <Grid item xs={12}>
                      <SnapshotHistoryChartContainer showIndividualTabs />
                    </Grid>
                    {/* <Grid item xs={12}>
                      <ChartToolboxContainer />
                    </Grid> */}
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ paddingBottom: 0 }}>
          {/* todo: this block should be refactored to its own component */}
          <ExpansionPanel
            expanded={uiStateStore!.netWorthItemsExpanded}
            onChange={() =>
              uiStateStore!.setNetWorthItemsExpanded(!uiStateStore!.netWorthItemsExpanded)
            }
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Grid container justify="space-between">
                <Grid item>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <ListIcon />
                    <Box ml={1}>
                      <Typography variant="overline">{t('label.item_table')}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item className={classes.secondaryHeader}>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <Tooltip
                      title={t('label.prices_fetched_from_interval') || ''}
                      placement="bottom"
                    >
                      <Typography variant="body2" className={classes.creditText}>
                        {t('label.prices_fetched_from')}
                        <a
                          className={classes.inlineLink}
                          href="https://poe.ninja"
                          onClick={(e) => openLink(e)}
                        >
                          https://poe.ninja
                        </a>
                      </Typography>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
              style={{
                background: theme.palette.background.default,
                display: 'block',
              }}
            >
              {uiStateStore!.showItemTableFilter && <ItemTableFilterSection />}
              <ItemTableContainer />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    </FeatureWrapper>
  );
};

export default inject('accountStore', 'signalrStore', 'uiStateStore')(observer(NetWorth));
