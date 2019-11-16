import createMuiTheme, { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import { Palette } from '@material-ui/core/styles/createPalette';

const defaultTheme = createMuiTheme();

export default function exilenceTheme() {
    return createMuiTheme({
        overrides: {
            MuiToolbar: {
              gutters: {
                [defaultTheme.breakpoints.up('xs')]: {
                  paddingLeft: '8px',
                  paddingRight: '8px',
                },
              },
            },
          },
        palette: {
            primary: {
                light: '#fff',
                main: '#e91e63'
             },
             secondary: {
               main: '#000',
             },
             type: 'dark'
        }
    });
}