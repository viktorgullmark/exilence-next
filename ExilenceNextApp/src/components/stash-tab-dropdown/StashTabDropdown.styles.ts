import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) =>
  createStyles({
    chip: {
      background: theme.palette.secondary.light,
    },
    chipLabel: {},
  })
);

export default useStyles;
