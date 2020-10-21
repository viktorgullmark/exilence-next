import React from 'react';
import { Box, TableCell, TableHead, TableRow, TableSortLabel, useTheme } from '@material-ui/core';

import { IColumn } from '../../../interfaces/column.interface';
import { ITableItem } from '../../../interfaces/table-item.interface';
import { Order } from '../ItemTable';
import { useStyles } from '../ItemTable.styles';

type ItemTableHeaderProps = {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ITableItem) => void;
  order: Order;
  orderBy: string;
  columns: IColumn[];
};

const ItemTableHeader = ({
  classes,
  order,
  orderBy,
  onRequestSort,
  columns,
}: ItemTableHeaderProps) => {
  const createSortHandler = (property: keyof ITableItem) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  const theme = useTheme();

  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{
              minWidth: headCell.minWidth,
              backgroundColor: theme.palette.secondary.main,
              maxWidth: headCell.maxWidth,
              width: headCell.maxWidth,
            }}
          >
            {(() => {
              switch (headCell.id) {
                case 'icon':
                  return <>{headCell.label}</>;
                default:
                  return (
                    <Box height="58">
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={order}
                        onClick={createSortHandler(headCell.id)}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <span className={classes.visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </span>
                        ) : null}
                      </TableSortLabel>
                    </Box>
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
