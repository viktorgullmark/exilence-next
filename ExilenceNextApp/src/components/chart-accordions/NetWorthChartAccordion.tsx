import React from 'react';
import { Box, Grid, Skeleton, Typography, useTheme } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from '../expansion-panel/ExpansionPanel';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useStores } from '../..';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import ChartToolboxContainer from '../chart-toolbox/ChartToolboxContainer';
import SnapshotHistoryChartContainer from '../snapshot-history-chart/SnapshotHistoryChartContainer';

const NetWorthChartAccordion = () => {
  const { uiStateStore } = useStores();
  const { t } = useTranslation();

  const theme = useTheme();

  const loading = !uiStateStore.profilesLoaded || uiStateStore.isValidating;

  if (loading) {
    return <Skeleton variant="rectangular" height={40} />;
  }

  return (
    <Accordion
      expanded={uiStateStore!.netWorthChartExpanded}
      onChange={() => uiStateStore!.setNetWorthChartExpanded(!uiStateStore!.netWorthChartExpanded)}
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
  );
};

export default observer(NetWorthChartAccordion);
