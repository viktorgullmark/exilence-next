import { makeStyles, useTheme } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { TableRow, TableCell, Box } from '@material-ui/core';
import { IColumn } from '../../../interfaces/column.interface';
import uuid from 'uuid';
import clsx from 'clsx';
import { IPricedItem } from '../../../interfaces/priced-item.interface';
import { rarityColors } from '../../../assets/themes/exilence-theme';
import { ItemUtils } from '../../../utils/item.utils';
import ImageIcon from '@material-ui/icons/Image';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  tableCell: {
    padding: theme.spacing(1)
  },
  iconCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(1)
  },
  iconImg: {
    minHeight: 35,
    maxHeight: 35,
    maxWidth: 120
  },
}));

interface ItemTableRowProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  columns: IColumn[];
  row: T;
}

const ItemTableRow: React.FC<ItemTableRowProps<IPricedItem>> = ({
  columns,
  row
}: ItemTableRowProps<IPricedItem>) => {
  const classes = useStyles();
  const theme = useTheme();
  const [iconLoaded, setIconLoaded] = useState(false);

  const handleImageLoad = () => {
    setIconLoaded(true);
  };

  return (
    <TableRow hover role="checkbox" tabIndex={-1} key={uuid.v4()}>
      {columns.map(column => {
        const value = row[column.id];
        const rarityColor =
          rarityColors[ItemUtils.getRarity(row['frameType'])];
        return (
          <TableCell
            className={classes.tableCell}
            key={column.id}
            align={column.align}
          >
            {(() => {
              switch (column.id) {
                case 'icon':
                  return (
                    <div
                      style={{
                        borderLeft: `5px solid ${rarityColor}`,
                        background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, rgba(0,0,0,0) 100%)`
                      }}
                      className={clsx({
                        [classes.iconCell]: column.id === 'icon'
                      })}
                    >
                      <Box position="relative" alignItems="center" justifyContent="center" display="flex" className={classes.iconImg}>
                        {!iconLoaded && (
                          <CircularProgress size={20} />
                        )}
                        <img
                          className={classes.iconImg}
                          alt={row['name']}
                          title={row['name']}
                          style={!iconLoaded ? { display: 'none' } : {}}
                          src={typeof value === 'string' ? value : ''}
                          onLoad={handleImageLoad}
                        />
                      </Box>
                    </div>
                  );
                case 'name':
                  return (
                    <span
                      style={{
                        color: rarityColor
                      }}
                    >
                      {value}
                    </span>
                  );
                default:
                  return (
                    <>
                      {column.format && typeof value === 'number'
                        ? column.format(value)
                        : value}
                    </>
                  );
              }
            })()}
          </TableCell>
        );
      })}
    </TableRow>
  );
};

export default observer(ItemTableRow);
