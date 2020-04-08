import { TextField, IconButton, Box, Paper, Card } from '@material-ui/core';
import { observer, inject } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { IPricedItem } from '../../../interfaces/priced-item.interface';
import useStyles from './ItemTableFilterSubtotal.styles';
import { itemColors, cardColors } from '../../../assets/themes/exilence-theme';
import clsx from 'clsx';

interface ItemTableFilterSubtotalProps {
  array: IPricedItem[];
}

const ItemTableFilterSubtotal: React.FC<ItemTableFilterSubtotalProps> = ({
  array: array
}: ItemTableFilterSubtotalProps) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const sumString =
    ' ' +
    array
      .map(i => i.total)
      .reduce((a, b) => a + b, 0)
      .toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      });

  return (
    <Paper className={clsx(classes.paper)}>
      {t('label.filter_total')}
      <span style={{ color: itemColors.chaosOrb }}>&nbsp;{sumString} c </span>
    </Paper>
  );
};

export default observer(ItemTableFilterSubtotal);
