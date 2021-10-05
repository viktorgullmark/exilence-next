import { IconButton, TablePagination as _MuiTablePagination } from '@mui/material';
import { TablePaginationActionsProps } from '@mui/material/TablePagination/TablePaginationActions';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { default as React, PropsWithChildren, ReactElement, useCallback } from 'react';
import { TableInstance } from 'react-table';
import { makeStyles, useTheme } from '@mui/styles';

const rowsPerPageOptions = [5, 10, 25, 50];

// avoid all of the redraws caused by the internal withStyles
const interestingPropsEqual = (prevProps: any, nextProps: any) =>
  prevProps.count === nextProps.count &&
  prevProps.rowsPerPage === nextProps.rowsPerPage &&
  prevProps.page === nextProps.page &&
  prevProps.onChangePage === nextProps.onChangePage &&
  prevProps.onChangeRowsPerPage === nextProps.onChangeRowsPerPage;

// a bit of a type hack to keep OverridableComponent working as desired
type T = typeof _MuiTablePagination;
const MuiTablePagination: T = React.memo(_MuiTablePagination, interestingPropsEqual) as T;

type ButtonEvent = React.MouseEvent<HTMLButtonElement, MouseEvent> | null;

const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

export function TablePagination<T extends object>({
  instance,
}: PropsWithChildren<{ instance: TableInstance<T> }>): ReactElement | null {
  const {
    state: { pageIndex, pageSize, rowCount = instance.rows.length },
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = instance;

  const handleChangePage = useCallback(
    (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
      if (newPage === pageIndex + 1) {
        nextPage();
      } else if (newPage === pageIndex - 1) {
        previousPage();
      } else {
        gotoPage(newPage);
      }
    },
    [gotoPage, nextPage, pageIndex, previousPage]
  );

  const onChangeRowsPerPage = useCallback(
    (e) => {
      setPageSize(Number(e.target.value));
    },
    [setPageSize]
  );

  return rowCount ? (
    <MuiTablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      component="div"
      count={rowCount}
      rowsPerPage={pageSize}
      page={pageIndex}
      onPageChange={handleChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
      ActionsComponent={TablePaginationActions}
    />
  ) : null;
}

const TablePaginationActions = ({
  count,
  onPageChange,
  page,
  rowsPerPage,
}: TablePaginationActionsProps) => {
  const classes = useStyles();
  const theme = useTheme();

  const handleFirstPageButtonClick = (event: ButtonEvent) => onPageChange(event, 0);

  const handleBackButtonClick = (event: ButtonEvent) => onPageChange(event, page - 1);

  const handleNextButtonClick = (event: ButtonEvent) => onPageChange(event, page + 1);

  const handleLastPageButtonClick = (event: ButtonEvent) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
};
