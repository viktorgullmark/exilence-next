import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { Palette } from '@material-ui/core/styles/createPalette';

export default function exilenceTheme() {
    return createMuiTheme({
        palette: {
            primary: {
                light: '#fff',
                main: 'rgb(23, 105, 170)',
                dark: '#000'
             },
             secondary: {
               main: '#f44336',
             }
        } as Palette
    } as ThemeOptions);
}