import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
const defaultTheme = createMuiTheme({ palette: { type: 'dark' }});

const primaryLight = '#e91e63';
const primaryMain = '#a31545';
const primaryDark = '#720e30';
export const primaryDarker = '#4a091f';
export const cardColor = '#15313e';

export const rarityColors = {
  normal: '#c0c0c0',
  magic: '#8888FF',
  rare: '#EBEB57',
  unique: '#da7a36',
  gem: '#1ba29b',
  currency: '#AD904B',
  divination: '#c0c0c0',
  quest: '#6eb930'
};

export const itemColors = {
  chaosOrb: '#f0cc00'
}

export type Rarity = typeof rarityColors;
export type ItemColors = typeof itemColors;

export const primaryGradient = `linear-gradient(90deg, ${primaryDark} 0%, ${primaryMain} 35%, ${primaryDarker} 100%)`;

export default function exilenceTheme() {
  return createMuiTheme({
    overrides: {
      MuiToolbar: {
        gutters: {
          [defaultTheme.breakpoints.up('xs')]: {
            paddingLeft: '8px',
            paddingRight: '8px'
          }
        }
      },
      MuiTableRow: {
        root: {
          "&$hover:hover": {
            backgroundColor: defaultTheme.palette.background.default
          }
        }
      },
      MuiTableCell: {
        root: {
          fontSize: '0.75rem'
        }
      },
    },
    palette: {
      primary: {
        light: primaryLight,
        main: primaryMain,
        dark: primaryDark
      },
      secondary: {
        light: '#696969',
        main: '#000',
        dark: '#333333'
      },
      background: {
        default: '#191919',
        paper: '#232323'
      },
      type: 'dark'
    }
  });
}
