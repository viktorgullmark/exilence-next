import { Box, Grid, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { currencyChangeColors, fontColors } from '../../assets/themes/exilence-theme';
import { formatValue } from '../../utils/snapshot.utils';

const useStyles = makeStyles(theme => ({
  iconWrapper: {},
  topContent: {
    borderBottom: `1px solid ${fontColors.hintDarker}`,
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  ellipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    textAlign: 'right'
  },
  title: {
    fontSize: '0.8rem'
  },
  secondary: {
    fontWeight: 'bold'
  },
  valueSuffix: {
    color: theme.palette.text.secondary,
    fontSize: '1.1rem'
  },
  currencyChange: {},
  positiveChange: {
    color: currencyChangeColors.positive
  },
  negativeChange: {
    color: currencyChangeColors.negative
  },
  tooltip: {
    maxWidth: 150
  }
}));

interface OverviewWidgetContentProps {
  value: number | string;
  valueIsDiff?: boolean;
  valueSuffix?: string;
  secondaryValue?: number | string;
  secondaryValueIsDiff?: boolean;
  secondaryValueStyles?: React.CSSProperties;
  title: string;
  icon: JSX.Element;
  valueColor?: string;
  currency?: boolean;
  currencyShort?: string;
  tooltip?: string;
}

const OverviewWidgetContent: React.FC<OverviewWidgetContentProps> = ({
  icon,
  title,
  value,
  valueIsDiff,
  valueSuffix,
  secondaryValue,
  secondaryValueIsDiff,
  secondaryValueStyles,
  valueColor,
  currency,
  currencyShort,
  tooltip
}: OverviewWidgetContentProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <>
      <Grid container className={classes.topContent}>
        <Grid item sm={3}>
          <div className={classes.iconWrapper}>{icon}</div>
        </Grid>
        <Grid item sm={9}>
          <div className={classes.ellipsis}>
            <Typography variant="h6" align="right" style={{ color: valueColor }}>
              {currency ? `${formatValue(value, currencyShort, valueIsDiff, true)}` : value}
              <span className={classes.valueSuffix}>{valueSuffix}</span>
            </Typography>
          </div>
        </Grid>
      </Grid>
      <Box mt={1}>
        <Grid container spacing={1}>
          <Grid item sm={6}>
            <Typography component="span" style={{}} className={classes.title}>
              {t(title)}
            </Typography>
          </Grid>
          <Grid item sm={6}>
            <Tooltip title={tooltip} classes={{ tooltip: classes.tooltip }} placement="bottom-end">
              <div className={classes.ellipsis}>
                {secondaryValue && secondaryValueIsDiff ? (
                  <Typography
                    component="span"
                    noWrap
                    style={secondaryValueStyles}
                    className={clsx(classes.secondary, {
                      [classes.currencyChange]: currency,
                      [classes.positiveChange]: secondaryValue > 0,
                      [classes.negativeChange]: secondaryValue < 0
                    })}
                  >
                    {formatValue(secondaryValue, currencyShort, true)}
                  </Typography>
                ) : (
                  <Typography
                    component="span"
                    noWrap
                    style={secondaryValueStyles}
                    className={clsx(classes.secondary, {
                      [classes.currencyChange]: currency
                    })}
                  >
                    {secondaryValue !== 0 ? secondaryValue : ''}
                  </Typography>
                )}
              </div>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default observer(OverviewWidgetContent);
