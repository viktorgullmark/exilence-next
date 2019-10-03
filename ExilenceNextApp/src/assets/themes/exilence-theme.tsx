import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { Palette } from '@material-ui/core/styles/createPalette';

export default function exilenceTheme() {
    return createMuiTheme({
        palette: {
            primary: {
                light: '#fff',
                main: '#e91e63'
             },
             secondary: {
               main: '#f44336',
             },
             type: 'dark'
        } as Palette
    } as ThemeOptions);
}