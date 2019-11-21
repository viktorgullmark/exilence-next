import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { observer } from 'mobx-react';
import { IPricedItem } from '../../interfaces/priced-item.interface';
import { toolbarHeight, resizeHandleContainerHeight } from '../header/Header';
import { innerToolbarHeight } from '../toolbar/Toolbar';
import { cardHeight } from '../widget/Widget';
import { netWorthGridSpacing } from '../../routes/net-worth/NetWorth';
import { useTranslation } from 'react-i18next';
import uuid from 'uuid';
import { IMergedItem } from '../../helpers/item.helper';
import clsx from 'clsx';

export const tableFooterHeight = 52;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    height: `calc(100vh - ${toolbarHeight}px - ${resizeHandleContainerHeight}px - ${innerToolbarHeight}px - ${cardHeight}px - ${theme.spacing(
      netWorthGridSpacing * 3
    )}px)`
  },
  tableWrapper: {
    overflow: 'auto',
    height: `calc(100% - ${tableFooterHeight}px)`
  },
  pagination: {
    height: tableFooterHeight
  },
  iconCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconImg: {
    minHeight: 35,
    maxHeight: 35,
    maxWidth: 120,
  }
}));

interface ItemTableProps {
  items: IPricedItem[];
}

interface Column {
  id:
    | 'icon'
    | 'name'
    | 'links'
    | 'quality'
    | 'level'
    | 'corrupted'
    | 'stackSize'
    | 'calculated'
    | 'total';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const ItemTable: React.FC<ItemTableProps> = ({ items }: ItemTableProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const columns: Column[] = [
    { id: 'icon', label: t('tables:header.icon'), minWidth: 120 },
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

  console.log(rows);

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
                  style={{ minWidth: column.minWidth }}
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={uuid.v4()}>
                    {columns.map(column => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {(() => {
                            switch (column.id) {
                              case 'icon':
                                return (
                                  <div
                                    className={clsx({
                                      [classes.iconCell]: column.id === 'icon'
                                    })}
                                  >
                                    <img
                                      className={classes.iconImg}
                                      alt={row['name']}
                                      title={row['name']}
                                      src={
                                        typeof value === 'string' ? value : ''
                                      }
                                    />
                                  </div>
                                );
                              case 'name':
                                return (
                                  <>
                                    {value ? `${value}, ` : ''}{row['typeLine']}
                                  </>
                                )
                              default:
                                return (
                                  <>
                                    {column.format && typeof value === 'number'
                                      ? column.format(value)
                                      : value}
                                  </>
                                );
                            }
                          })()}
                        </TableCell>
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
