import TableContainer from '@material-ui/core/TableContainer';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import clsx from 'clsx';
import React, { CSSProperties, useEffect } from 'react';
import { Cell, HeaderGroup, Meta, Row, TableInstance } from 'react-table';
import { useDebounce } from '../../hooks/use-debounce';
import { ResizeHandle } from '../resize-handle/ResizeHandle';
import { TablePagination } from '../table-pagination/TablePagination';
import { useStyles } from './TableWrapper.styles';

type TableWrapperProps = {
  instance: TableInstance<object>;
  onClick?: (row: Row<object>) => void;
  setInitialState: any;
};

const getStyles = <T extends object>(props: any, _disableResizing = false, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'center',
      display: 'flex',
    },
  },
];

const headerProps = <T extends object>(
  props: any,
  { column }: Meta<T, { column: HeaderGroup<T> }>
) => getStyles(props, column && column.disableResizing, column && column.align);

const cellProps = <T extends object>(props: any, { cell }: Meta<T, { cell: Cell<T> }>) =>
  getStyles(props, cell.column && cell.column.disableResizing, cell.column && cell.column.align);

const TableWrapper = ({ instance, onClick, setInitialState }: TableWrapperProps) => {
  const classes = useStyles();

  const { getTableProps, headerGroups, prepareRow, page, getTableBodyProps, state }: any = instance;

  const debouncedState = useDebounce(state, 500);

  useEffect(() => {
    const { sortBy, filters, pageSize, columnResizing, hiddenColumns } = debouncedState;
    const val = {
      sortBy,
      filters,
      pageSize,
      columnResizing,
      hiddenColumns,
    };
    setInitialState(val);
  }, [setInitialState, debouncedState]);

  const cellClickHandler = (cell: Cell<object>) => () => {
    onClick && cell.column.id !== '_selector' && onClick(cell.row);
  };

  return (
    <TableContainer className={classes.container}>
      <div className={classes.tableTable} {...getTableProps()}>
        <div>
          {headerGroups.map((headerGroup, i) => (
            <div
              {...headerGroup.getHeaderGroupProps()}
              className={classes.tableHeadRow}
              key={`headersGroup_${i}`}
            >
              {headerGroup.headers.map((column, j) => {
                const style = {
                  textAlign: column.align ? column.align : 'left ',
                } as CSSProperties;
                return (
                  <div
                    {...column.getHeaderProps(headerProps)}
                    className={classes.tableHeadCell}
                    key={`column_${j}`}
                  >
                    {column.canSort ? (
                      <TableSortLabel
                        active={column.isSorted}
                        direction={column.isSortedDesc ? 'desc' : 'asc'}
                        {...column.getSortByToggleProps()}
                        className={classes.tableSortLabel}
                        style={style}
                      >
                        {column.render('Header')}
                      </TableSortLabel>
                    ) : (
                      <div style={style} className={classes.tableLabel}>
                        {column.render('Header')}
                      </div>
                    )}
                    {column.canResize && <ResizeHandle column={column} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div {...getTableBodyProps()} className={classes.tableBody}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <div
                {...row.getRowProps()}
                className={clsx(classes.tableRow, { [classes.rowSelected]: row.isSelected })}
                key={`row_${i}`}
              >
                {row.cells.map((cell, j) => {
                  return (
                    <div
                      {...cell.getCellProps(cellProps)}
                      onClick={cellClickHandler(cell)}
                      className={classes.tableCell}
                      key={`cell_${j}`}
                    >
                      {cell.render('Cell')}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <TablePagination instance={instance} />
    </TableContainer>
  );
};

export default TableWrapper;
