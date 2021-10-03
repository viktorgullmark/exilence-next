import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(
  createStyles({
    columnsPopOver: {
      padding: 24,
    },
    popoverTitle: {
      fontWeight: 500,
      padding: '0 24px 24px 0',
      textTransform: 'uppercase',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 198px)',
      '@media (max-width: 600px)': {
        gridTemplateColumns: 'repeat(1, 160px)',
      },
      gridColumnGap: 6,
      gridRowGap: 6,
    },
  })
);

export default useStyles;
