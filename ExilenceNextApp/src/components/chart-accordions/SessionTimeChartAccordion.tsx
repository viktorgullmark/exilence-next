import React from 'react';
import { Box, Grid, Skeleton, Typography, useTheme } from '@mui/material';
import { Accordion, AccordionDetails, AccordionSummary } from '../expansion-panel/ExpansionPanel';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useStores } from '../..';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import SessionTimeHistoryChartContainer from '../session-time-history-chart/SessionTimeHistoryChartContainer';
import ChartToolboxContainer from '../session-chart-toolbox/NetWorthSessionChartToolboxContainer';

const SessionTimeChartAccordion = () => {
  const { uiStateStore } = useStores();
  const { t } = useTranslation();

  const theme = useTheme();

  const isLoading = !uiStateStore.profilesLoaded || uiStateStore.isValidating;

  if (isLoading) {
    return <Skeleton variant="rectangular" height={40} />;
  }

  return (
    <Accordion
      expanded={uiStateStore!.sessionTimeChartExpanded}
      onChange={() =>
        uiStateStore!.setSessionTimeChartExpanded(!uiStateStore!.sessionTimeChartExpanded)
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
            <Typography variant="overline">{t('label.sessiontime_chart')}</Typography>
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
            <SessionTimeHistoryChartContainer />
          </Grid>
          <Grid item xs={12}>
            <ChartToolboxContainer />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default observer(SessionTimeChartAccordion);
