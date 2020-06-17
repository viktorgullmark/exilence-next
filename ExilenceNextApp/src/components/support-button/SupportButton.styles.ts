import { makeStyles, createStyles } from '@material-ui/core';

export const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      top: '52vh',
      zIndex: 10,
      right: 16,
      position: 'fixed',
      width: 0,
      height: 0
    },
    button: {
      transform: 'rotate(-90deg)',
      transformOrigin: 'bottom left',
      color: theme.palette.text.primary,
      background: theme.palette.primary.main,
      padding: '4px 8px',
      borderTopLeftRadius: 6,
      borderTopRightRadius: 6,
      fontWeight: 'bold',
      fontSize: '0.8rem',
      '&:hover': {
        background: theme.palette.primary.light
      }
    },
    noMargin: {
      right: -16
    }
  })
);
