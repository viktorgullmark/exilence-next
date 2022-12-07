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
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();
  const { uiStateStore, accountStore, settingStore, priceStore } = useStores();
  const session = accountStore.getSelectedAccount.activeProfile?.session;

  const toggleIncome = () => {
    let mode = uiStateStore.netWorthSessionIncomeMode;
    if (mode === 'sessionDuration' && session?.incomeSinceLastPause !== undefined) {
      mode = 'lastPause';
    } else if (mode === 'lastPause' && session?.incomeSinceLastOffline !== undefined) {
      mode = 'lastOffline';
    } else if (mode === 'lastOffline' && session?.incomeSinceLastInactive !== undefined) {
      mode = 'lastInactive';
    } else if (mode === 'lastInactive' && session?.incomeSinceLastHour !== undefined) {
      mode = 'lastHour';
    } else {
      mode = 'sessionDuration';
    }

    uiStateStore.setNetWorthSessionIncomeMode(mode);
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

  const tooltipTitle = useMemo(() => {
    if (!isOpen) return;

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
          {mode === 'lastInactive' ? <strong>{inactive}</strong> : inactive}
          {mode === 'lastHour' ? <strong>{hour}</strong> : hour}
        </Typography>
        <em>{t('action.income_switch')}</em>
      </>
    );
  }, [isOpen, uiStateStore.netWorthSessionIncomeMode, session?.snapshots, t]);

  return (
    <Tooltip
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      title={tooltipTitle}
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
