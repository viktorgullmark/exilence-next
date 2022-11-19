import React, { useMemo, useState } from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { useTranslation } from 'react-i18next';
import useStyles from './IncomeSwitch.styles';
import { useStores } from '../../..';
import { NetWorthSessionIncomeMode } from '../../../types/net-worth-session-income-mode.type';
import { formatValue } from '../../../utils/snapshot.utils';
import { observer } from 'mobx-react-lite';

type IncomeSwitchProps = {
  currencyShort?: string;
  valueIsDiff?: boolean;
  valueSuffix?: string;
};

const IncomeSwitch = ({ currencyShort, valueIsDiff, valueSuffix }: IncomeSwitchProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { uiStateStore, accountStore, settingStore, priceStore } = useStores();
  const session = accountStore.getSelectedAccount.activeProfile?.session;

  const toggleIncome = () => {
    // cycle over current setting and choose next valid mode
    const chooseIncome = (mode?: NetWorthSessionIncomeMode): NetWorthSessionIncomeMode => {
      switch (mode || uiStateStore.netWorthSessionIncomeMode) {
        case 'sessionDuration':
          return 'lastPause';
        case 'lastPause':
          return 'lastOffline';
        case 'lastOffline':
          return 'lastInactiv';
        case 'lastInactiv':
          return 'lastHour';
        case 'lastHour':
          return 'sessionDuration';
      }
    };
    const isValid = (mode: NetWorthSessionIncomeMode) => {
      switch (mode) {
        case 'sessionDuration':
          return true;
        case 'lastPause':
          return session?.incomeSinceLastPause !== undefined;
        case 'lastOffline':
          return session?.incomeSinceLastOffline !== undefined;
        case 'lastInactiv':
          return session?.incomeSinceLastInactive !== undefined;
        case 'lastHour':
          return session?.incomeSinceLastHour !== undefined;
      }
    };
    let nextMode = chooseIncome();
    while (!isValid(nextMode)) {
      nextMode = chooseIncome(nextMode);
    }
    uiStateStore.setNetWorthSessionIncomeMode(nextMode);
  };

  const getExaltedValue = (value: number) => {
    if (settingStore.currency === 'exalt' && priceStore.exaltedPrice) {
      value = value / priceStore.exaltedPrice;
    }
    if (settingStore.currency === 'divine' && priceStore.divinePrice) {
      value = value / priceStore.divinePrice;
    }
    return value;
  };

  const getFormatedValue = (value: number) => {
    return formatValue(
      getExaltedValue(value),
      currencyShort,
      valueIsDiff,
      true,
      !priceStore.exaltedPrice
    );
  };

  const toottipTitle = useMemo(() => {
    if (!open) return;

    const sessionDuration = (
      <>
        {t('label.income_based_on_session_duration_tooltip_short')} ={' '}
        {getFormatedValue(session?.incomeSessionDuration || 0)} {valueSuffix}
        <br />
      </>
    );

    const pause = (
      <>
        {t('label.income_based_on_last_pause_tooltip_short')} ={' '}
        {getFormatedValue(session?.incomeSinceLastPause || 0)} {valueSuffix}
        <br />
      </>
    );

    const offline = (
      <>
        {t('label.income_based_on_last_offline_tooltip_short')} ={' '}
        {getFormatedValue(session?.incomeSinceLastOffline || 0)} {valueSuffix}
        <br />
      </>
    );

    const inactive = (
      <>
        {t('label.income_based_on_last_inactive_tooltip_short')} ={' '}
        {getFormatedValue(session?.incomeSinceLastInactive || 0)} {valueSuffix}
        <br />
      </>
    );

    const hour = (
      <>
        {t('label.income_based_on_last_hour_tooltip_short')} ={' '}
        {getFormatedValue(session?.incomeSinceLastHour || 0)} {valueSuffix}
        <br />
      </>
    );
    const mode = uiStateStore.netWorthSessionIncomeMode;
    return (
      <>
        <Typography variant="subtitle1" color="inherit" gutterBottom noWrap>
          {mode === 'sessionDuration' ? <strong>{sessionDuration}</strong> : sessionDuration}
          {mode === 'lastPause' ? <strong>{pause}</strong> : pause}
          {mode === 'lastOffline' ? <strong>{offline}</strong> : offline}
          {mode === 'lastInactiv' ? <strong>{inactive}</strong> : inactive}
          {mode === 'lastHour' ? <strong>{hour}</strong> : hour}
        </Typography>
        <em>{t('action.income_switch')}</em>
      </>
    );
  }, [open, uiStateStore.netWorthSessionIncomeMode, session?.snapshots, t]);

  return (
    <Tooltip
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      title={toottipTitle}
      placement="bottom-end"
    >
      <IconButton
        data-tour-elem="incomeSwitch"
        size="small"
        className={classes.adornmentIcon}
        onClick={() => toggleIncome()}
      >
        <ChangeCircleIcon />
      </IconButton>
    </Tooltip>
  );
};

export default observer(IncomeSwitch);
