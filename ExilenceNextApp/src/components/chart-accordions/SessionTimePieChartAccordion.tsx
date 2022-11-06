import React from 'react';
import { Box, Grid, Skeleton, Typography, useTheme } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from '../expansion-panel/ExpansionPanel';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useStores } from '../..';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import SnapshotHistoryChartContainer from '../snapshot-history-chart/SnapshotHistoryChartContainer';
import SessionTimeHistoryChartContainer from '../session-time-history-chart/SessionTimeHistoryChartContainer';
import ChartToolboxContainer from '../chart-toolbox/ChartToolboxContainer';
import SessionTimeHistoryPieChartContainer from '../session-time-history-pie-chart/SessionTimeHistoryPieChartContainer';
import { chartHeight } from '../../routes/net-worth/NetWorth';

const SessionTimePieChartAccordion = () => {
  const { uiStateStore } = useStores();
  const { t } = useTranslation();

  const theme = useTheme();

  const loading = !uiStateStore.profilesLoaded || uiStateStore.isValidating;

  if (loading) {
    return <Skeleton variant="rectangular" height={40} />;
  }

  const sessionDurationPieChartHeight = chartHeight + 42;

  return (
    <Accordion
      expanded={uiStateStore!.sessionTimePieChartExpanded}
      onChange={() =>
        uiStateStore!.setSessionTimePieChartExpanded(!uiStateStore!.sessionTimePieChartExpanded)
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
            <Typography variant="overline">{t('label.sessiontime_pie_chart')}</Typography>
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
            <SessionTimeHistoryPieChartContainer chartHeight={sessionDurationPieChartHeight} />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default observer(SessionTimePieChartAccordion);
