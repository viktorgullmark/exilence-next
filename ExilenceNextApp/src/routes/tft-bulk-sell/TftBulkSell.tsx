import { Box, Grid, Tooltip, Typography, useTheme } from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import { Skeleton } from '@material-ui/lab';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { appName, useStores, visitor } from '../..';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from '../../components/expansion-panel/ExpansionPanel';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import ItemTableFilterSection from '../../components/item-table/item-table-filter-section/ItemTableFilterSection';
import ItemTableContainer from '../../components/item-table/ItemTableContainer';
import { openLink } from '../../utils/window.utils';
import { useStyles } from './NetWorth.styles';
import TftColumnPresetsPanel from '../../components/tft-column-presets-panel/TftColumnPresetsPanel';
import TftPrerequisitesPanel from '../../components/tft-prerequisites-panel/TftPrerequisitesPanel';
import TftStepsPanel from '../../components/tft-steps-panel/TftStepsPanel';

export const netWorthGridSpacing = 2;
export const cardHeight = 100;
export const chartHeight = 240;

const TftBulkSell = () => {
  const { accountStore, uiStateStore } = useStores();
  const theme = useTheme();
  const { t } = useTranslation();
  const classes = useStyles();

  const loading = !uiStateStore.profilesLoaded || uiStateStore.isValidating;

  useEffect(() => {
    if (!uiStateStore!.validated && !uiStateStore!.initiated && !uiStateStore!.isValidating) {
      accountStore!.validateSession('/tft-bulk-sell');
    }

    visitor!.pageview('/tft-bulk-sell', appName).send();
  }, []);

  return (
    <FeatureWrapper>
      <Grid container spacing={netWorthGridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              {loading ? <Skeleton variant="rect" height={40} /> : <TftPrerequisitesPanel />}
            </Grid>
            <Grid item xs={5}>
              {loading ? <Skeleton variant="rect" height={40} /> : <TftStepsPanel />}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {loading ? <Skeleton variant="rect" height={40} /> : <TftColumnPresetsPanel />}
        </Grid>
        <Grid item xs={12} style={{ paddingBottom: 0 }}>
          {loading ? (
            <Skeleton variant="rect" height={1000} />
          ) : (
            <ExpansionPanel expanded>
              <ExpansionPanelSummary>
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
                id="items-table"
                style={{
                  background: theme.palette.background.default,
                  display: 'block',
                }}
              >
                {uiStateStore!.showItemTableFilter && <ItemTableFilterSection />}
                <ItemTableContainer tftView askingPriceInputValue="10c" />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}
        </Grid>
      </Grid>
    </FeatureWrapper>
  );
};

export default observer(TftBulkSell);
