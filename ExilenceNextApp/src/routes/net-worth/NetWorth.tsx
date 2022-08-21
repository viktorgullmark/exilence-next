import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UpdateIcon from '@mui/icons-material/Update';
import { Box, Grid, Skeleton, Tooltip, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { appName, useStores, visitor } from '../..';
import { primaryLighter, rarityColors } from '../../assets/themes/exilence-theme';
import ChartToolboxContainer from '../../components/chart-toolbox/ChartToolboxContainer';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '../../components/expansion-panel/ExpansionPanel';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import ItemTableFilterSection from '../../components/item-table/item-table-filter-section/ItemTableFilterSection';
import ItemTableContainer from '../../components/item-table/ItemTableContainer';
import OverviewWidgetContent from '../../components/overview-widget-content/OverviewWidgetContent';
import SnapshotHistoryChartContainer from '../../components/snapshot-history-chart/SnapshotHistoryChartContainer';
import SparklineChart from '../../components/sparkline-chart/SparklineChart';
import Widget from '../../components/widget/Widget';
import { getSnapshotCardValue } from '../../utils/snapshot.utils';
import { openLink } from '../../utils/window.utils';
import { useStyles } from './NetWorth.styles';

export const netWorthGridSpacing = 2;
export const cardHeight = 100;
export const chartHeight = 180;

const NetWorth = () => {
  const { accountStore, signalrStore, uiStateStore, settingStore, priceStore } = useStores();
  const theme = useTheme();
  const activeProfile = accountStore!.getSelectedAccount.activeProfile;
  const { activeGroup } = signalrStore!;
  const { t } = useTranslation();
  const classes = useStyles();

  const loading = () => {
    return !uiStateStore.profilesLoaded || uiStateStore.isValidating;
  };

  const updateTimeLabel = () => {
    let timeLabel: string | undefined;
    if (activeGroup) {
      timeLabel = activeGroup?.timeSinceLastSnapshot;
    } else {
      timeLabel = activeProfile?.timeSinceLastSnapshot;
    }
    uiStateStore.setTimeSincePricesFetchedLabel(priceStore.timeSincePricesFetched);
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

  const getExaltedValue = (value: number) => {
    if (settingStore.currency === 'exalt' && priceStore.exaltedPrice) {
      value = value / priceStore.exaltedPrice;
    }
    if (settingStore.currency === 'divine' && priceStore.divinePrice) {
      value = value / priceStore.divinePrice;
    }
    return value;
  };

  useEffect(() => {
    if (!uiStateStore!.validated && !uiStateStore!.initiated && !uiStateStore!.isValidating) {
      accountStore!.validateSession('/net-worth');
    }

    visitor!.pageview('/net-worth', appName).send();
    uiStateStore!.setBulkSellView(false);
  }, []);

  const chartData = activeGroup
    ? activeGroup.sparklineChartData
    : activeProfile?.sparklineChartData;

  const tabChartHeight = chartHeight + 42;

  const displayedValue = activeGroup ? activeGroup.netWorthValue : netWorthValue();
  const displayedIncome = activeGroup
    ? getExaltedValue(activeGroup.income)
    : getExaltedValue(income());

  return (
    <FeatureWrapper>
      <Grid container spacing={netWorthGridSpacing}>
        <Grid item xs={6} md={4} lg={3} xl={2}>
          <Widget
            loading={loading() || (!priceStore.exaltedPrice && displayedValue !== 0)}
            backgroundColor={theme.palette.secondary.main}
          >
            <OverviewWidgetContent
              value={displayedValue}
              secondaryValue={activeGroup ? activeGroup.lastSnapshotChange : lastSnapshotChange()}
              secondaryValueIsDiff
              secondaryValueStyles={{ fontSize: '0.8rem' }}
              title="label.total_value"
              valueColor={rarityColors.currency}
              currencyShort={settingStore.activeCurrency.short}
              icon={<MonetizationOnIcon fontSize="medium" />}
              currency
              tooltip="Change in value between the two latest snapshots"
              sparklineChart={
                chartData && (
                  <SparklineChart
                    internalName="networth"
                    color={primaryLighter}
                    height={25}
                    width={90}
                    data={chartData}
                  />
                )
              }
              currencySwitch
            />
          </Widget>
        </Grid>
        <Grid item xs={6} md={4} lg={3} xl={2}>
          <Widget
            loading={loading() || (!priceStore.exaltedPrice && displayedIncome !== 0)}
            backgroundColor={theme.palette.secondary.main}
          >
            <OverviewWidgetContent
              value={displayedIncome}
              valueIsDiff
              valueSuffix={` ${t('label.hour_suffix')}`}
              title="label.total_income"
              valueColor={rarityColors.currency}
              icon={<TrendingUpIcon fontSize="medium" />}
              currencyShort={settingStore.activeCurrency.short}
              currency
              secondaryValue={`${t('label.income_based_on')}`}
              secondaryValueStyles={{
                color: theme.palette.text.primary,
                fontSize: '0.8rem',
                fontWeight: 'normal',
              }}
              tooltip={t('label.income_based_on_tooltip')}
              clearFn={activeGroup ? undefined : () => activeProfile?.clearIncome()}
            />
          </Widget>
        </Grid>
        <Grid item xs={6} md={4} lg={3} xl={2}>
          <Widget loading={loading()} backgroundColor={theme.palette.secondary.main}>
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
              icon={<UpdateIcon fontSize="medium" />}
              tooltip="Time since last snapshot"
            />
          </Widget>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              {/* todo: this block should be refactored to its own component */}
              {loading() ? (
                <Skeleton variant="rectangular" height={40} />
              ) : (
                <Accordion
                  expanded={uiStateStore!.netWorthChartExpanded}
                  onChange={() =>
                    uiStateStore!.setNetWorthChartExpanded(!uiStateStore!.netWorthChartExpanded)
                  }
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <ShowChartIcon fontSize="small" />
                      <Box ml={1}>
                        <Typography variant="overline">{t('label.net_worth_chart')}</Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails
                    style={{
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
                  </AccordionDetails>
                </Accordion>
              )}
            </Grid>
            <Grid item xs={5}>
              {loading() ? (
                <Skeleton variant="rectangular" height={40} />
              ) : (
                <Accordion
                  expanded={uiStateStore!.tabChartExpanded}
                  onChange={() =>
                    uiStateStore!.setTabChartExpanded(!uiStateStore!.tabChartExpanded)
                  }
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <StackedLineChartIcon fontSize="small" />
                      <Box ml={1}>
                        <Typography variant="overline">{t('label.tab_chart')}</Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails
                    style={{
                      background: theme.palette.background.default,
                    }}
                  >
                    <Grid container>
                      <Grid item xs={12}>
                        <SnapshotHistoryChartContainer
                          chartHeight={tabChartHeight}
                          showIndividualTabs
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ paddingBottom: 0 }}>
          {/* todo: this block should be refactored to its own component */}
          {loading() ? (
            <Skeleton variant="rectangular" height={1000} />
          ) : (
            <Accordion
              expanded={uiStateStore!.netWorthItemsExpanded}
              onChange={() =>
                uiStateStore!.setNetWorthItemsExpanded(!uiStateStore!.netWorthItemsExpanded)
              }
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <UpdateIcon fontSize="small" />
                      <Box ml={1}>
                        <Typography variant="overline">{t('label.item_table')}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item className={classes.secondaryHeader}>
                    <Tooltip
                      title={t('label.prices_fetched_from_interval') || ''}
                      placement="bottom"
                    >
                      <Box display="flex" justifyContent="center" alignItems="center">
                        {uiStateStore!.timeSincePricesFetchedLabel && (
                          <>
                            <Typography variant="body2" className={classes.creditText}>
                              {t('label.prices_fetched_from')}
                              <a
                                className={classes.inlineLink}
                                href="https://poe.ninja"
                                onClick={(e) => openLink(e)}
                              >
                                https://poe.ninja
                              </a>
                              &nbsp;
                              {uiStateStore!.timeSincePricesFetchedLabel}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Tooltip>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails
                id="items-table"
                style={{
                  background: theme.palette.background.default,
                  display: 'block',
                }}
              >
                {uiStateStore!.showItemTableFilter && <ItemTableFilterSection />}
                <ItemTableContainer searchFilterText={uiStateStore!.itemTableFilterText} />
              </AccordionDetails>
            </Accordion>
          )}
        </Grid>
      </Grid>
    </FeatureWrapper>
  );
};

export default observer(NetWorth);
