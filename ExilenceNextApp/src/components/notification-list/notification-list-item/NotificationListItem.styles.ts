import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  notification: {
    paddingTop: 0,
    paddingBottom: theme.spacing(0.25),
    '&:focus': {
      outline: 'none',
    },
  },
  timestamp: {
    display: 'inline',
    fontSize: '12px',
    color: theme.palette.primary.light,
  },
  description: {
    fontSize: '0.75rem',
  },
  notificationItem: {
    fontSize: '14px',
  },
  secondary: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    maxWidth: 400,
    textOverflow: 'ellipsis',
  },
  avatarColor: {
    color: theme.palette.secondary.light,
    backgroundColor: theme.palette.secondary.dark,
  },
}));

export default useStyles;
