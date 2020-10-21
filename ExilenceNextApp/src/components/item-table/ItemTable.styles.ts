import { createStyles, makeStyles } from '@material-ui/core';

import { tableFooterHeight } from './ItemTable';

export const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    tableWrapper: {
      overflow: 'auto',
      height: `calc(100% - ${tableFooterHeight}px)`,
    },
    noItems: {
      height: 'auto',
    },
    pagination: {
      height: tableFooterHeight,
      backgroundColor: theme.palette.secondary.main,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  })
);

export default useStyles;
