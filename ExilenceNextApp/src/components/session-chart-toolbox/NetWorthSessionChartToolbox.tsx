import React from 'react';
import { Box, Grid, ListItem, ListItemText } from '@mui/material';

import useStyles from './NetWorthSessionChartToolbox.styles';
import { HistoryChartSeriesMode } from '../../types/history-chart-series-mode.type';
import { useTranslation } from 'react-i18next';

export interface HistoryChartSeriesModeWording {
  mode: HistoryChartSeriesMode;
  wording: string;
}

type NetWorthSessionChartToolboxProps = {
  selectedChartMode: HistoryChartSeriesMode;
  options: HistoryChartSeriesModeWording[];
  handleChangeMode: (value: HistoryChartSeriesMode) => void;
};

const NetWorthSessionChartToolbox = ({
  selectedChartMode,
  options,
  handleChangeMode,
}: NetWorthSessionChartToolboxProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Box className={classes.root} display="flex" justifyContent="flex-end" alignItems="flex-end">
      <Grid className={classes.grid} container>
        {options.map((o) => (
          <Grid xs key={o.mode} className={classes.option} item>
            <ListItem
              button
              onClick={() => handleChangeMode(o.mode)}
              className={classes.listItem}
              classes={{ selected: classes.selected }}
              selected={o.mode === selectedChartMode}
            >
              <ListItemText
                primary={t(o.wording)}
                className={classes.optionText}
                classes={{ primary: classes.primaryText }}
              />
            </ListItem>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NetWorthSessionChartToolbox;
