import { Box, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  iconWrapper: {},
  title: {
    fontSize: '0.7rem'
  }
}));

interface OverviewWidgetContentProps {
  value: number | string;
  title: string;
  icon: JSX.Element;
  valueColor?: string;
  currency?: boolean;
  currencyShort?: string;
}

const OverviewWidgetContent: React.FC<OverviewWidgetContentProps> = ({
  icon,
  title,
  value,
  valueColor,
  currency,
  currencyShort
}: OverviewWidgetContentProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Grid container spacing={1}>
        <Grid item sm={3}>
          <div className={classes.iconWrapper}>{icon}</div>
        </Grid>
        <Grid item sm={9}>
          <Typography variant="h6" align="right" style={{ color: valueColor }}>
            {currency ? `${value} ${currencyShort}` : value}
          </Typography>
        </Grid>
      </Grid>
      <Box mt={1}>
        <Typography component="span" className={classes.title}>
          {t(title)}
        </Typography>
      </Box>
    </>
  );
};

export default observer(OverviewWidgetContent);
