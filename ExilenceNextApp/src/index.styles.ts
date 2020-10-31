import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  app: {
    height: '100%',
    animation: `$fadeIn 300ms ease-in`,
    animationFillMode: 'forwards',
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
}));

export default useStyles;
