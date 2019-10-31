import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';
import Image from '../../assets/img/blight-bg.jpg';
const useStyles = makeStyles((theme: Theme) => ({
  '@global': {
    'html, body': {
      height: '100%'
    },
    '#root': {
      height: '100%',
      background: `linear-gradient(rgba(16, 16, 16, 0.8), rgba(16, 16, 16, 0.8)), url(${Image})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    },
    '.container': {
      display: 'flex',
      flexWrap: 'wrap'
    },
    '.full-width': {
      width: '100%'
    },
    '.form-title': {
      textAlign: 'center'
    }
  }
}));

const GlobalStyles: React.FC = () => {
  useStyles();
  return null;
};

export default GlobalStyles;
