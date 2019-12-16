import {
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  useTheme
} from '@material-ui/core';
import React from 'react';
import { IColumn } from '../../../interfaces/column.interface';
import { IPricedItem } from '../../../interfaces/priced-item.interface';
import { Order, useStyles } from '../ItemTable';

interface ItemTableHeaderProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IPricedItem
  ) => void;
  order: Order;
  orderBy: string;
  columns: IColumn[];
}

const ItemTableHeader: React.FC<ItemTableHeaderProps> = (
  props: ItemTableHeaderProps
) => {
  const { classes, order, orderBy, onRequestSort, columns } = props;
  const createSortHandler = (property: keyof IPricedItem) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  const theme = useTheme();

  return (
    <TableHead>
      <TableRow>
        {columns.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{
              minWidth: headCell.minWidth,
              backgroundColor: theme.palette.secondary.main,
              maxWidth: headCell.maxWidth,
              width: headCell.maxWidth
            }}
          >
            {(() => {
              switch (headCell.id) {
                case 'icon':
                  return <>{headCell.label}</>;
                default:
                  return (
                    <>
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={order}
                        onClick={createSortHandler(headCell.id)}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <span className={classes.visuallyHidden}>
                            {order === 'desc'
                              ? 'sorted descending'
                              : 'sorted ascending'}
                          </span>
                        ) : null}
                      </TableSortLabel>
                    </>
                  );
              }
            })()}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default ItemTableHeader;
