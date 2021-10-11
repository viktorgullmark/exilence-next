import { Box, Grid, Tooltip, Typography, useTheme } from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import { Skeleton } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { appName, useStores, visitor } from '../..';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '../../components/expansion-panel/ExpansionPanel';
import FeatureWrapper from '../../components/feature-wrapper/FeatureWrapper';
import ItemTableFilterSection from '../../components/item-table/item-table-filter-section/ItemTableFilterSection';
import ItemTableContainer from '../../components/item-table/ItemTableContainer';
import { openLink } from '../../utils/window.utils';
import { useStyles } from './BulkSell.styles';
// import BulkSellColumnPresetsPanel from '../../components/bulk-sell-column-presets-panel/BulkSellColumnPresetsPanel';
import BulkSellPrerequisitesPanel from '../../components/bulk-sell-prerequisites-panel/BulkSellPrerequisitesPanel';
import BulkSellStepsPanel from '../../components/bulk-sell-steps-panel/BulkSellStepsPanel';

export const netWorthGridSpacing = 2;
export const cardHeight = 100;
export const chartHeight = 240;

const BulkSell = () => {
  const { accountStore, uiStateStore } = useStores();
  const theme = useTheme();
  const { t } = useTranslation();
  const classes = useStyles();

  const loading = !uiStateStore.profilesLoaded || uiStateStore.isValidating;

  useEffect(() => {
    if (!uiStateStore!.validated && !uiStateStore!.initiated && !uiStateStore!.isValidating) {
      accountStore!.validateSession('/bulk-sell');
    }
    visitor!.pageview('/bulk-sell', appName).send();
    uiStateStore!.setBulkSellView(true);
  }, []);

  return (
    <FeatureWrapper>
      <Grid container spacing={netWorthGridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              {loading ? <Skeleton variant="rectangular" height={40} /> : <BulkSellStepsPanel />}
            </Grid>
            <Grid item xs={7}>
              {loading ? (
                <Skeleton variant="rectangular" height={40} />
              ) : (
                <BulkSellPrerequisitesPanel />
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ paddingBottom: 0 }}>
          {loading ? (
            <Skeleton variant="rectangular" height={1000} />
          ) : (
            <Accordion expanded>
              <AccordionSummary>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <UpdateIcon />
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
                          &nbsp;
                          {uiStateStore!.timeSincePricesFetchedLabel}
                        </Typography>
                      </Tooltip>
                    </Box>
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
                <ItemTableContainer
                  bulkSellView
                  searchFilterText={uiStateStore!.bulkSellItemTableFilterText}
                />
              </AccordionDetails>
            </Accordion>
          )}
        </Grid>
      </Grid>
    </FeatureWrapper>
  );
};

export default observer(BulkSell);
