import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import uuid from 'uuid';
import { IColumn } from '../../interfaces/column.interface';
import { ITableItem } from '../../interfaces/table-item.interface';
import ItemTableCell from './item-table-cell/ItemTableCell';
import ItemTableHeader from './item-table-header/ItemTableHeader';
import { useStyles } from './ItemTable.styles';
import { Group } from '../../store/domains/group';
import ItemTablePaginationActions from './item-table-pagination-actions/ItemTablePaginationActions';

export type Order = 'asc' | 'desc';

export const tableFooterHeight = 52;

interface ItemTableProps {
  items: ITableItem[];
  pageIndex: number;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  changePage: (i: number) => void;
  order: Order;
  orderBy: keyof ITableItem;
  setOrderBy: (col: keyof ITableItem) => void;
  setOrder: (order: Order) => void;
  activeGroup?: Group;
}

const ItemTable: React.FC<ItemTableProps> = ({
  items,
  pageIndex,
  pageSize,
  setPageSize,
  changePage,
  order,
  orderBy,
  setOrder,
  setOrderBy,
  activeGroup
}: ItemTableProps) => {
  const classes = useStyles();
  const { t } = useTranslation(['tables']);

  const columns: IColumn[] = [
    {
      id: 'icon',
      label: t('tables:header.icon'),
      minWidth: 100,
      maxWidth: 140
    },
    { id: 'name', label: t('tables:header.name'), minWidth: 50, maxWidth: 220 },
    { id: 'ilvl', label: t('tables:header.ilvl'), minWidth: 50, maxWidth: 120 },
    {
      id: 'tabNames',
      label: t('tables:header.tab_names'),
      minWidth: 60,
      maxWidth: 100
    },
    {
      id: 'corrupted',
      label: t('tables:header.corrupted'),
      minWidth: 60,
      maxWidth: 100
    },
    {
      id: 'links',
      label: t('tables:header.links'),
      minWidth: 60,
      numeric: true
    },
    {
      id: 'quality',
      label: t('tables:header.quality'),
      minWidth: 60,
      numeric: true
    },
    {
      id: 'level',
      label: t('tables:header.level'),
      minWidth: 60,
      numeric: true
    },
    {
      id: 'stackSize',
      label: t('tables:header.stacksize'),
      minWidth: 60,
      numeric: true
    },
    {
      id: 'calculated',
      label: t('tables:header.calculated'),
      minWidth: 60,
      format: (value: number) => value.toFixed(2),
      numeric: true
    },
    {
      id: 'total',
      label: t('tables:header.total'),
      minWidth: 60,
      format: (value: number) => value.toFixed(2),
      numeric: true
    }
  ];

  const rows: ITableItem[] = items;

  rows.forEach(item => {
    const img = new Image();
    img.src = item.icon;
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    changePage(newPage);
  };

  function desc<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function stableSort<T>(array: T[], cmp: (a: T, b: T) => number) {
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
  }

  function getSorting<K extends keyof any>(
    order: Order,
    orderBy: K
  ): (
    a: { [key in K]: number | string | boolean },
    b: { [key in K]: number | string | boolean }
  ) => number {
    return order === 'desc'
      ? (a, b) => desc(a, b, orderBy)
      : (a, b) => -desc(a, b, orderBy);
  }

  const getColumns = () => {
    return activeGroup ? columns.filter(c => c.id !== 'tabNames') : columns;
  }

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof ITableItem
  ) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
    handleChangePage(event, 0);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(+event.target.value);
    handleChangePage(event, 0);
  };
  return (
    <>
      <Paper
        className={clsx(classes.root, { [classes.noItems]: rows.length === 0 })}
      >
        <div className={classes.tableWrapper}>
          <Table stickyHeader aria-label="sticky table">
            <ItemTableHeader
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              columns={getColumns()}
            />
            <TableBody>
              {stableSort<ITableItem>(rows, getSorting(order, orderBy))
                .slice(
                  pageIndex * pageSize,
                  pageIndex * pageSize + pageSize
                )
                .map(row => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={uuid.v4()}
                    >
                      {getColumns().map(column => {
                        return (
                          <ItemTableCell
                            key={uuid.v4()}
                            column={column}
                            value={row[column.id]}
                            frameType={row['frameType']}
                          />
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          className={classes.pagination}
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={pageSize}
          page={pageIndex}
          backIconButtonProps={{
            'aria-label': 'previous page'
          }}
          nextIconButtonProps={{
            'aria-label': 'next page'
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          ActionsComponent={ItemTablePaginationActions}
        />
      </Paper>
    </>
  );
};

export default observer(ItemTable);
