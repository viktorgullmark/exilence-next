import { Paper } from '@mui/material';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../..';
import { rarityColors } from '../../../assets/themes/exilence-theme';
import { IPricedItem } from '../../../interfaces/priced-item.interface';
import useStyles from './ItemTableFilterSubtotal.styles';

type ItemTableFilterSubtotalProps = {
  array: IPricedItem[];
};

const ItemTableFilterSubtotal = ({ array }: ItemTableFilterSubtotalProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { priceStore, settingStore, uiStateStore } = useStores();

  let value = array.map((i) => i.total).reduce((a, b) => a + b, 0);

  if (settingStore.currency === 'exalt') {
    if (priceStore.exaltedPrice) {
      value = value / priceStore.exaltedPrice;
    } else {
      value = 0;
    }
  }

  if (settingStore.currency === 'divine') {
    if (priceStore.divinePrice) {
      value = value / priceStore.divinePrice;
    } else {
      value = 0;
    }
  }

  // FIXME: remove unnecessary .map()
  const sumString =
    ' ' +
    value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });

  return (
    <>
      {(uiStateStore?.itemTableFilterText !== '' || uiStateStore?.showItemTableFilter) && (
        <Paper className={clsx(classes.paper)}>
          {t('label.filter_total')}
          <span style={{ color: rarityColors.currency }}>
            &nbsp;{sumString} {settingStore.activeCurrency.short}
          </span>
        </Paper>
      )}
    </>
  );
};

export default observer(ItemTableFilterSubtotal);
