import { createStyles, makeStyles } from '@material-ui/core';

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
