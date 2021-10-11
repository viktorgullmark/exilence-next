import {
  amber,
  blue,
  deepOrange,
  deepPurple,
  green,
  grey,
  lime,
  orange,
  pink,
  red,
  teal,
} from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const defaultTheme = createTheme({ palette: { mode: 'dark' } });

const primaryLight = '#e91e63';
const primaryMain = '#a31545';
const primaryDark = '#720e30';

const infoLight = '#d3d3d3';
const infoMain = '#c9c9c9';
const infoDark = '#b5b5b5';

export const primaryLighter = '#ff2e75';
export const primaryDarker = '#4a091f';
export const primaryDarkest = '#280310';

export const fontColors = {
  hintDarker: 'rgba(255, 255, 255, 0.2)',
};

export const highchartsColors = [
  primaryMain,
  deepOrange[300],
  orange[300],
  lime[300],
  teal[300],
  amber[300],
  deepPurple[300],
  pink[300],
  blue[300],
];

export const secondary = {
  light: '#4e4e4e',
  main: '#1e1e1e',
  dark: '#000',
};

export const gridSpacing = 2;

export const cardColors = {
  primary: 'linear-gradient(90deg, #273238 0%, #1c262b 100%)',
  secondary: 'linear-gradient(90deg, #1d3e3b 0%, #192f2d 100%)',
  third: 'linear-gradient(90deg, #14384a 0%, #082533 100%)',
};

export const rarityColors = {
  normal: '#c0c0c0',
  magic: '#8888FF',
  rare: '#EBEB57',
  unique: '#da7a36',
  gem: '#1ba29b',
  currency: '#AD904B',
  divination: '#c0c0c0',
  quest: '#6eb930',
  unknown: '#fff',
  legacy: '#82ad6a',
};

export const itemColors = {
  chaosOrb: '#d6b600',
  corrupted: 'rgb(255 123 123)',
  custom: '#38cfba',
};

export const statusColors = {
  success: green[800],
  warning: amber[900],
  info: grey[900],
  error: red[900],
};

export const currencyChangeColors = {
  positive: green[600],
  negative: red[700],
};

export const background = {
  default: '#151515',
  paper: '#202020',
  darker: '#0e0e0e',
};

export type Rarity = typeof rarityColors;
export type ItemColor = typeof itemColors;
export type StatusColor = typeof statusColors;

export const primaryGradient = `linear-gradient(90deg, ${primaryDark} 0%, ${primaryMain} 35%, ${primaryDarkest} 100%)`;

export default function exilenceTheme() {
  return createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1300,
        xl: 1950,
      },
    },
    components: {
      MuiToolbar: {
        styleOverrides: {
          gutters: {
            [defaultTheme.breakpoints.up('xs')]: {
              paddingLeft: '8px',
              paddingRight: 0,
            },
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            // todo: test
            '&.Mui-hovered': {
              backgroundColor: defaultTheme.palette.background.default,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            fontSize: '0.75rem',
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            color: '#c2c2c2',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
    palette: {
      text: {
        primary: '#fff',
        secondary: '#c2c2c2',
      },
      primary: {
        light: primaryLight,
        main: primaryMain,
        dark: primaryDark,
      },
      secondary: secondary,
      background: background,
      info: {
        light: infoLight,
        main: infoMain,
        dark: infoDark,
      },
      mode: 'dark',
    },
    typography: {
      h6: {
        fontWeight: 400,
        fontSize: '1.15rem',
      },
    },
    transitions: {
      duration: {
        enteringScreen: 0,
        leavingScreen: 0,
      },
    },
  });
}
