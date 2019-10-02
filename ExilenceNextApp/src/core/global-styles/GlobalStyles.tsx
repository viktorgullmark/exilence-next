import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
    '@global': {
        'html, body': {
            height: "100%"
        },
        'body': {
            padding: theme.spacing(2)
        },
        '#root': {
            height: "100%"
        },
        '.container': {
            display: 'flex',
            flexWrap: 'wrap'
        },
        '.full-width': {
            width: "100%"
        },
        '.form-title': {
            textAlign: "center"
        }
    },
}));

const GlobalStyles: React.FC = () => {
    useStyles();
    return null;
}

export default GlobalStyles;