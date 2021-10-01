import { Theme } from '@mui/material';

import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const tableHeadCellBorder = '1px solid rgba(56, 56, 56, 1)';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      background: '#202020',
    },
    tableTable: {
      borderSpacing: 0,
    },
    tableHeadRow: {
      outline: 0,
      right: 2,
      verticalAlign: 'middle',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      fontWeight: 500,
      lineHeight: '1.5rem',
      position: 'relative',
      borderBottom: '1px solid rgba(81, 81, 81, 1)',
      '&:hover': {
        opacity: 1,
      },
    },
    tableHeadCell: {
      padding: '8px 1px 8px 16px',
      fontSize: '0.75rem',
      textAlign: 'left',
      verticalAlign: 'inherit',
      color: theme.palette.text.primary,
      fontWeight: 500,
      lineHeight: '1.5rem',
      borderRight: tableHeadCellBorder,
      borderTop: tableHeadCellBorder,
      '&:last-child': {
        borderRight: 'none',
      },
      '&:first-child': {
        borderLeft: 'none',
      },
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    tableRow: {
      color: 'inherit',
      outline: 0,
      verticalAlign: 'middle',
      '&:hover': {
        backgroundColor: '#303030',
      },
      borderBottom: '1px solid rgba(81, 81, 81, 1)',
    },
    placeholderRow: {
      backgroundColor: theme.palette.background.paper,
      '&:hover': {
        backgroundColor: theme.palette.background.paper,
      },
    },
    rowSelected: {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.07)',
      },
    },
    tableCell: {
      padding: 10,
      fontSize: '0.75rem',
      textAlign: 'left',
      lineHeight: 1.43,
      verticalAlign: 'inherit',
      color: theme.palette.text.primary,
      '&:last-child': {
        borderRight: 'none',
      },
    },
    tableSortLabel: {
      '& svg': {
        width: 16,
        height: 16,
        marginTop: 0,
        marginLeft: 2,
      },
    },
    headerIcon: {
      '& svg': {
        width: 16,
        height: 16,
        marginTop: 4,
        marginRight: 0,
      },
    },
    iconDirectionAsc: {
      transform: 'rotate(90deg)',
    },
    iconDirectionDesc: {
      transform: 'rotate(180deg)',
    },
    tableBody: {
      display: 'flex',
      flex: '1 1 auto',
      width: '100%',
      flexDirection: 'column',
    },
    tableLabel: {},
    cellIcon: {
      '& svg': {
        width: 16,
        height: 16,
        marginTop: 3,
      },
    },
  })
);
