import { Theme } from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { primaryLighter } from '../../assets/themes/exilence-theme';
import { hex2rgba } from '../../utils/misc.utils';

const tableHeadCellBorder = '1px solid rgba(56, 56, 56, 0.6)';
const tableCellBorder = '1px solid rgba(56, 56, 56, 0.2)';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      background: '#202020',
    },
    tableTable: {
      borderSpacing: 0,
    },
    tableHeadRow: {
      boxShadow: `0 2px 15px 0 ${hex2rgba(primaryLighter, 0.15)}`,
      outline: 0,
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
      padding: '4px 1px 4px 16px',
      fontSize: '0.75rem',
      textAlign: 'left',
      verticalAlign: 'inherit',
      color: theme.palette.text.primary,
      fontWeight: 500,
      lineHeight: '1.5rem',
      borderRight: tableHeadCellBorder,
      borderTop: tableHeadCellBorder,
      '&:first-child': {
        borderLeft: tableHeadCellBorder,
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
        backgroundColor: `rgba(163, 21, 69, 0.16)`,
      },
      borderBottom: '1px solid rgba(81, 81, 81, 0.6)',
    },
    disabledSortBy: {
      paddingRight: theme.spacing(2),
    },
    placeholderRow: {
      backgroundColor: theme.palette.background.paper,
      '&:hover': {
        backgroundColor: theme.palette.background.paper,
      },
    },
    noFlex: {
      flex: 'none !important',
    },
    rowSelected: {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.07)',
      },
    },
    tableCell: {
      padding: `6px 14px`,
      fontSize: '0.75rem',
      textAlign: 'left',
      height: 42,
      lineHeight: 1.43,
      verticalAlign: 'inherit',
      color: theme.palette.text.primary,
      borderRight: tableCellBorder,
      borderLeft: tableCellBorder,
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
