import makeStyles from '@mui/styles/makeStyles';
import { toolbarHeight } from '../header/Header';

const useStyles = makeStyles((theme) => ({
  content: {
    height: `calc(100% - ${toolbarHeight}px)`,
    flexGrow: 1,
  },
  contentContainer: {
    'box-shadow': '0px 0px 32px 1px rgba(0,0,0,0.77)',
    borderRadius: 0,
    padding: theme.spacing(5, 5),
  },
}));

export default useStyles;
