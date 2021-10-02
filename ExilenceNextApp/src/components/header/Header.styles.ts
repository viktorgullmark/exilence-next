import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

import { primaryLighter } from '../../assets/themes/exilence-theme';
import { resizeHandleContainerHeight, toolbarHeight } from './Header';

export const patreonLogoHeight = 15;
export const patreonLogoWidth = 80;

const useStyles = makeStyles((theme) =>
  createStyles({
    header: {
      zIndex: 1290,
      backgroundColor: theme.palette.secondary.dark,
      backgroundImage: 'none',
    },
    title: {
      flexGrow: 1,
      fontSize: '0.85rem',
      textTransform: 'uppercase',
      letterSpacing: '4px',
      color: theme.palette.primary.light,
      fontWeight: 700,
    },
    version: {
      flexGrow: 1,
      color: theme.palette.text.disabled,
    },
    updateAvailable: {
      flexGrow: 1,
      color: '#20cc76',
    },
    patreonWrapper: {
      background: '#fff',
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
      padding: '1px 3px',
    },
    patreonLogo: {
      height: patreonLogoHeight,
      width: patreonLogoWidth,
    },
    toolbar: {
      minHeight: toolbarHeight,
      maxHeight: toolbarHeight,
      '-webkit-app-region': 'drag',
      paddingBottom: resizeHandleContainerHeight,
    },
    hide: {
      display: 'none',
    },
    resizeHandleContainer: {
      height: resizeHandleContainerHeight,
    },
    updateLink: {
      color: primaryLighter,
    },
    noDrag: {
      '-webkit-app-region': 'no-drag',
      cursor: 'pointer',
    },
    isActive: {
      backgroundColor: theme.palette.background.paper,
    },
    windowHandlerButton: {
      display: 'flex',
      alignItems: 'center',
      width: 40,
      justifyContent: 'center',
      height: resizeHandleContainerHeight + toolbarHeight,
      '&:hover': {
        backgroundColor: theme.palette.background.paper,
      },
    },
    exit: {
      '&:hover': {
        backgroundColor: theme.palette.error.dark,
      },
    },
    windowHandlers: {
      display: 'flex',
      alignItems: 'center',
    },
    windowIcon: {
      fontSize: 14,
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
      cursor: 'pointer',
    },
    support: {
      fontSize: 18,
    },
  })
);

export default useStyles;
