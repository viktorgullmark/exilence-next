import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme, createStyles, useTheme } from '@material-ui/core/styles';
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
import { IColumn } from '../../interfaces/column.interface';
import { IPricedItem } from '../../interfaces/priced-item.interface';
import { netWorthGridSpacing } from '../../routes/net-worth/NetWorth';
import { resizeHandleContainerHeight, toolbarHeight } from '../header/Header';
import { innerToolbarHeight } from '../toolbar/Toolbar';
import { cardHeight } from '../widget/Widget';
import ItemTableRow from './item-table-row/ItemTableRow';
import { netWorthTabGroupHeight } from '../net-worth-tab-group/NetWorthTabGroup';
import { tabPanelSpacing } from '../tab-panel/TabPanel';

export const tableFooterHeight = 52;

const useStyles = makeStyles((theme: Theme) =>
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
      backgroundColor: theme.palette.secondary.light
    }
  })
);

interface ItemTableProps {
  items: IPricedItem[];
}

const ItemTable: React.FC<ItemTableProps> = ({ items }: ItemTableProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();

  const columns: IColumn[] = [
    { id: 'icon', label: t('tables:header.icon'), minWidth: 100 },
    { id: 'name', label: t('tables:header.name'), minWidth: 170 },
    { id: 'links', label: t('tables:header.links'), minWidth: 60 },
    { id: 'quality', label: t('tables:header.quality'), minWidth: 60 },
    { id: 'level', label: t('tables:header.level'), minWidth: 60 },
    { id: 'corrupted', label: t('tables:header.corrupted'), minWidth: 60 },
    { id: 'stackSize', label: t('tables:header.stacksize'), minWidth: 60 },
    {
      id: 'calculated',
      label: t('tables:header.calculated'),
      minWidth: 60,
      format: (value: number) => value.toFixed(2)
    },
    {
      id: 'total',
      label: t('tables:header.total'),
      minWidth: 60,
      format: (value: number) => value.toFixed(2)
    }
  ];

  const rows: IPricedItem[] = items;

  rows.forEach(item => {
    const img = new Image();
    img.src = item.icon;
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor: theme.palette.secondary.light }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => {
                return (
                  <ItemTableRow key={uuid.v4()} columns={columns} row={row} />
                );
              })}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        className={classes.pagination}
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
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
