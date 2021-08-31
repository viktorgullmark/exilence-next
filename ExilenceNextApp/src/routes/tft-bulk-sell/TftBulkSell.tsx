import { Box, Button, Grid, TextField, Tooltip, Typography, useTheme } from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import { Skeleton } from '@material-ui/lab';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { appName, useStores, visitor } from '../..';
import ViewColumnsIcon from '@material-ui/icons/ViewColumn';
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
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

export const netWorthGridSpacing = 2;
export const cardHeight = 100;
export const chartHeight = 240;

const TftBulkSell = () => {
  const { accountStore, uiStateStore } = useStores();
  const theme = useTheme();
  const { t } = useTranslation();
  const classes = useStyles();

  const loading = () => {
    return !uiStateStore.profilesLoaded || uiStateStore.isValidating;
  };

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
              {/* todo: this block should be refactored to its own component */}
              {loading() ? (
                <Skeleton variant="rect" height={40} />
              ) : (
                <ExpansionPanel expanded>
                  <ExpansionPanelSummary>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <PlaylistAddCheckIcon fontSize="small" />
                      <Box ml={1}>
                        <Typography variant="overline">{t('label.prerequisites')}</Typography>
                      </Box>
                    </Box>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails
                    style={{
                      height: chartHeight,
                      background: theme.palette.background.default,
                    }}
                  >
                    <Grid container spacing={4}>
                      <Grid item xs={4}>
                        <TextField value="Expedition" disabled label="League (set in Profile)" />
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          style={{ width: 250 }}
                          value="Expedition"
                          disabled
                          label="Pricing League (set in Profile)"
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField label={t('label.asking_price')} value="10c" />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField disabled label={t('label.ign')} value="Ailupoison" />
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          label={t('label.generated_message')}
                          disabled
                          style={{ width: '100%' }}
                          value="WTS Expedition Softcore | 10c | IGN: Ailupoison"
                        />
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              )}
            </Grid>
            <Grid item xs={5}>
              {loading() ? (
                <Skeleton variant="rect" height={40} />
              ) : (
                <ExpansionPanel expanded>
                  <ExpansionPanelSummary>
                    <Box display="flex" justifyContent="center" alignItems="center">
                      <PlaylistAddCheckIcon fontSize="small" />
                      <Box ml={1}>
                        <Typography variant="overline">{t('label.steps')}</Typography>
                      </Box>
                    </Box>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails
                    style={{
                      height: chartHeight,
                      background: theme.palette.background.default,
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        1. Set <b>{t('label.asking_price')}</b>
                      </Grid>
                      <Grid item xs={12}>
                        2. <b>{t('label.generate_image')}</b>
                      </Grid>
                      <Grid item xs={12}>
                        3. <b>{t('label.open_tft')}</b>
                      </Grid>
                      <Grid item xs={12}>
                        4. {t('label.paste')} <b>{t('label.twice')}</b> {t('label.paste_reason')}
                      </Grid>
                      <Grid item xs={6}>
                        <Button variant="contained" color="primary">
                          {t('label.generate_image')}
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Button variant="outlined">{t('label.tft_demo')}</Button>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {/* todo: this block should be refactored to its own component */}
          {loading() ? (
            <Skeleton variant="rect" height={40} />
          ) : (
            <ExpansionPanel expanded>
              <ExpansionPanelSummary>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <ViewColumnsIcon fontSize="small" />
                  <Box ml={1}>
                    <Typography variant="overline">{t('label.column_presets')}</Typography>
                  </Box>
                </Box>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails
                style={{
                  height: 52,
                  background: theme.palette.background.default,
                }}
              >
                <Grid container spacing={2}>
                  <Button variant="contained">Divination Cards</Button>
                  <Button variant="outlined">Fragments</Button>
                  <Button variant="outlined">Fossils</Button>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )}
        </Grid>
        <Grid item xs={12} style={{ paddingBottom: 0 }}>
          {/* todo: this block should be refactored to its own component */}
          {loading() ? (
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
