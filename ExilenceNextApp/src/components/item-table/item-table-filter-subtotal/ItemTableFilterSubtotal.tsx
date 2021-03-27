import React from 'react';
import { useTranslation } from 'react-i18next';
import { Paper } from '@material-ui/core';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';

import { itemColors } from '../../../assets/themes/exilence-theme';
import { IPricedItem } from '../../../interfaces/priced-item.interface';
import useStyles from './ItemTableFilterSubtotal.styles';

type ItemTableFilterSubtotalProps = {
  array: IPricedItem[];
};

const ItemTableFilterSubtotal = ({ array }: ItemTableFilterSubtotalProps) => {
  const { t } = useTranslation();
  const classes = useStyles();

  // FIXME: remove unnecessary .map()
  const sumString =
    ' ' +
    array
      .map((i) => i.total)
      .reduce((a, b) => a + b, 0)
      .toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      });

  return (
    <Paper className={clsx(classes.paper)}>
      {t('label.filter_total')}
      <span style={{ color: itemColors.chaosOrb }}>&nbsp;{sumString} c </span>
    </Paper>
  );
};

export default observer(ItemTableFilterSubtotal);
