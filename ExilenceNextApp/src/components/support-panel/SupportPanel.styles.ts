import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) =>
  createStyles({
    popper: {
      zIndex: 10000,
      marginTop: theme.spacing(1),
      width: 200,
    },
    paper: {
      padding: theme.spacing(1, 0),
    },
    separator: {
      height: 1,
      background: theme.palette.primary.main,
      margin: theme.spacing(0.75, 1, 1),
    },
    list: {
      listStyleType: 'none',
      margin: 0,
      padding: 0,
    },
    option: {
      display: 'flex',
      justifyContent: 'space-between',
      cursor: 'pointer',
      padding: theme.spacing(0.5, 1.75),
      '&:hover': {
        background: theme.palette.primary.main,
      },
    },
    optionLink: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      textDecoration: 'none',
      cursor: 'pointer',
      padding: theme.spacing(0.5, 1.75),
      '&:active, &:visited, &:link': {
        color: theme.palette.text.primary,
      },
      '&:hover': {
        background: theme.palette.primary.main,
        color: theme.palette.text.primary,
      },
    },
    icon: {
      width: 18,
      height: 18,
    },
  })
);

export default useStyles;
