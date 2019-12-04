import Paper from '@material-ui/core/Paper';
import {
  makeStyles,
  Theme,
  createStyles,
  useTheme
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import uuid from 'uuid';
import { IPricedItem } from '../../interfaces/priced-item.interface';
import { netWorthGridSpacing } from '../../routes/net-worth/NetWorth';
import { resizeHandleContainerHeight, toolbarHeight } from '../header/Header';
import { innerToolbarHeight } from '../toolbar/Toolbar';
import { cardHeight } from '../widget/Widget';
import ItemTableRow from './item-table-row/ItemTableRow';
import { netWorthTabGroupHeight } from '../net-worth-tab-group/NetWorthTabGroup';
import { tabPanelSpacing } from '../tab-panel/TabPanel';
import ItemTableHeader from './item-table-header/ItemTableHeader';
import { IColumn } from '../../interfaces/column.interface';

export const tableFooterHeight = 52;

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: `calc(100vh - ${toolbarHeight}px - ${resizeHandleContainerHeight}px - ${innerToolbarHeight}px - ${cardHeight}px - ${theme.spacing(
        netWorthGridSpacing * 3 + tabPanelSpacing * 2
      )}px - ${netWorthTabGroupHeight}px)`
    },
    tableWrapper: {
      overflow: 'auto',
      height: `calc(100% - ${tableFooterHeight}px)`
    },
    pagination: {
      height: tableFooterHeight,
      backgroundColor: theme.palette.secondary.dark
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1
    }
  })
);

export type Order = 'asc' | 'desc';

interface ItemTableProps {
  items: IPricedItem[];
  pageIndex: number;
  changePage: (i: number) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({
  items,
  pageIndex,
  changePage
}: ItemTableProps) => {
  const classes = useStyles();
  const { t } = useTranslation(['tables']);
  const [orderBy, setOrderBy] = useState<keyof IPricedItem>('name');
  const [order, setOrder] = useState<Order>('asc');

  const columns: IColumn[] = [
    { id: 'icon', label: t('tables:header.icon'), minWidth: 100 },
    { id: 'name', label: t('tables:header.name'), minWidth: 50, maxWidth: 220 },
    { id: 'links', label: t('tables:header.links'), minWidth: 60 },
    { id: 'quality', label: t('tables:header.quality'), minWidth: 60 },
    {
      id: 'level',
      label: t('tables:header.level'),
      minWidth: 60,
      numeric: true
    },
    { id: 'corrupted', label: t('tables:header.corrupted'), minWidth: 60 },
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

  const rows: IPricedItem[] = items;

  rows.forEach(item => {
    const img = new Image();
    img.src = item.icon;
  });

  const [rowsPerPage, setRowsPerPage] = useState(25);

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

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IPricedItem
  ) => {
    const isDesc = orderBy === property && order === 'desc';
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleChangePage(event, 1);
    setRowsPerPage(+event.target.value);
  };
  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table stickyHeader aria-label="sticky table">
          <ItemTableHeader
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            columns={columns}
          />
          <TableBody>
            {rows.length !== 0 ? (
              stableSort<IPricedItem>(rows, getSorting(order, orderBy))
                .slice(
                  pageIndex * rowsPerPage,
                  pageIndex * rowsPerPage + rowsPerPage
                )
                .map(row => {
                  return (
                    <ItemTableRow key={uuid.v4()} columns={columns} row={row} />
                  );
                })
            ) : (
              <h2 style={{ textAlign: 'center' }}>
                {t('label.stash_tab_placeholder')}
              </h2>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        className={classes.pagination}
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={pageIndex}
        backIconButtonProps={{
          'aria-label': 'previous page'
        }}
        nextIconButtonProps={{
          'aria-label': 'next page'
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default observer(ItemTable);
