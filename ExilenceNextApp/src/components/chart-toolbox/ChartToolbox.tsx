import React from 'react';
import { Box, Grid, ListItem, ListItemText } from '@mui/material';

import { TimespanType } from '../../types/timespan.type';
import useStyles from './ChartToolbox.styles';

type ChartToolboxProps = {
  selectedChartTimeSpan: TimespanType;
  handleChangeTimeSpan: (value: TimespanType) => void;
};

const ChartToolbox = ({ selectedChartTimeSpan, handleChangeTimeSpan }: ChartToolboxProps) => {
  const classes = useStyles();

  const options: TimespanType[] = ['1 day', '1 week', '1 month', 'All time'];

  return (
    <Box className={classes.root} display="flex" justifyContent="flex-end" alignItems="flex-end">
      <Grid className={classes.grid} container>
        {options.map((o) => (
          <Grid xs key={o} className={classes.option} item>
            <ListItem
              button
              onClick={() => handleChangeTimeSpan(o)}
              className={classes.listItem}
              classes={{ selected: classes.selected }}
              selected={o === selectedChartTimeSpan}
            >
              <ListItemText
                primary={o}
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
