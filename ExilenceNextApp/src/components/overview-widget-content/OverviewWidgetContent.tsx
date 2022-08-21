import { Cancel } from '@mui/icons-material';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../..';
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
  sparklineChart?: JSX.Element;
  valueColor?: string;
  currency?: boolean;
  currencyShort?: string;
  tooltip?: string;
  currencySwitch?: boolean;
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
  currencySwitch,
  sparklineChart,
}: OverviewWidgetContentProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { settingStore, priceStore } = useStores();

  const toggleCurrency = () => {
    // cycle over current setting and choose next
    const chooseCurrency = () => {
      switch (settingStore.currency) {
        case 'exalt':
          return 'divine';
        case 'divine':
          return 'chaos';
        case 'chaos':
          return 'exalt';
      }
    };
    settingStore.setCurrencyDisplay(chooseCurrency());
  };
  return (
    <>
      <Grid container className={classes.topContent}>
        <Grid item xs={5}>
          <Grid container spacing={2}>
            <Grid item sm={3}>
              {icon}
            </Grid>
            <Grid item sm={9}>
              <Box height={1} display="flex" alignItems="center">
                {sparklineChart}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={7}>
          <div className={classes.ellipsis}>
            <Typography variant="h6" align="right" style={{ color: valueColor }}>
              {currency
                ? `${formatValue(
                    value,
                    currencyShort,
                    valueIsDiff,
                    true,
                    !priceStore.exaltedPrice
                  )}`
                : value}
              {currency && currencySwitch && (
                <Tooltip
                  title={
                    <>
                      <Typography variant="subtitle1" color="inherit" gutterBottom>
                        1 ex = {priceStore.exaltedPrice?.toFixed(1)} c
                        <br />1 divine = {priceStore.divinePrice?.toFixed(1)} c
                      </Typography>
                      <em>{t('action.currency_switch')}</em>
                    </>
                  }
                  classes={{ tooltip: classes.tooltip }}
                  placement="bottom-end"
                >
                  <IconButton
                    data-tour-elem="currencySwitch"
                    size="small"
                    className={classes.adornmentIcon}
                    onClick={() => toggleCurrency()}
                  >
                    <ChangeCircleIcon />
                  </IconButton>
                </Tooltip>
              )}
              <span className={classes.valueSuffix}>{valueSuffix}</span>
              {clearFn && (
                <Tooltip
                  title={`${t('label.reset')}`}
                  classes={{ tooltip: classes.tooltip }}
                  placement="bottom-end"
                >
                  <IconButton
                    size="small"
                    data-tour-elem="resetIncome"
                    className={classes.adornmentIcon}
                    onClick={clearFn}
                  >
                    <Cancel />
                  </IconButton>
                </Tooltip>
              )}
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
