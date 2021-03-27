import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Grid, Tooltip, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { formatValue } from '../../utils/snapshot.utils';
import useStyles from './OverviewWidgetContent.styles';

type OverviewWidgetContentProps = {
  value: number | string;
  valueIsDiff?: boolean;
  valueSuffix?: string;
  secondaryValue?: number | string;
  secondaryValueIsDiff?: boolean;
  secondaryValueStyles?: React.CSSProperties;
  clearFn?: () => void;
  title: string;
  icon: JSX.Element;
  valueColor?: string;
  currency?: boolean;
  currencyShort?: string;
  tooltip?: string;
};

const OverviewWidgetContent = ({
  icon,
  title,
  value,
  valueIsDiff,
  valueSuffix,
  secondaryValue,
  secondaryValueIsDiff,
  secondaryValueStyles,
  clearFn,
  valueColor,
  currency,
  currencyShort,
  tooltip = '',
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
                      [classes.negativeChange]: secondaryValue < 0,
                    })}
                  >
                    {formatValue(secondaryValue, currencyShort, true)}
                  </Typography>
                ) : (
                  <>
                    <Typography
                      component="span"
                      noWrap
                      style={secondaryValueStyles}
                      className={clsx(classes.secondary, {
                        [classes.currencyChange]: currency,
                      })}
                    >
                      {secondaryValue !== 0 ? secondaryValue : ''}
                    </Typography>
                    {!secondaryValue && clearFn && (
                      <a className={classes.inlineLink} onClick={clearFn}>
                        {t('label.reset')}
                      </a>
                    )}
                  </>
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
