import React from 'react';
import { Box, Grid, ListItem, ListItemText } from '@mui/material';

import { TimespanType } from '../../types/timespan.type';
import useStyles from './ChartToolbox.styles';
import { useTranslation } from 'react-i18next';

export interface TimespanTypeWording {
  mode: TimespanType;
  wording: string;
}

type ChartToolboxProps = {
  selectedChartTimeSpan: TimespanType;
  options: TimespanTypeWording[];
  handleChangeTimeSpan: (value: TimespanType) => void;
};

const ChartToolbox = ({
  selectedChartTimeSpan,
  options,
  handleChangeTimeSpan,
}: ChartToolboxProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Box className={classes.root} display="flex" justifyContent="flex-end" alignItems="flex-end">
      <Grid className={classes.grid} container>
        {options.map((o) => (
          <Grid xs key={o.mode} className={classes.option} item>
            <ListItem
              button
              onClick={() => handleChangeTimeSpan(o.mode)}
              className={classes.listItem}
              classes={{ selected: classes.selected }}
              selected={o.mode === selectedChartTimeSpan}
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

export default ChartToolbox;
