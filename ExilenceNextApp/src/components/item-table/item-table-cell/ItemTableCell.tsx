import { Box, CircularProgress, TableCell } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  rarityColors,
  itemColors
} from '../../../assets/themes/exilence-theme';
import { IColumn } from '../../../interfaces/column.interface';
import { ItemUtils } from '../../../utils/item.utils';

const useStyles = makeStyles(theme => ({
  tableCell: {
    padding: theme.spacing(2),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
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
  }
}));

interface ItemTableCellProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number | boolean;
  column: IColumn;
  frameType: number;
}

const ItemTableCell: React.FC<ItemTableCellProps> = ({
  value,
  column,
  frameType
}: ItemTableCellProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const [iconLoaded, setIconLoaded] = useState(false);
  const { t } = useTranslation();

  const handleImageLoad = () => {
    setIconLoaded(true);
  };

  const tryParseNumber = (value: boolean | string | number) => {
    return column.format && typeof value === 'number'
      ? column.format(value)
      : value;
  };

  const rarityColor = rarityColors[ItemUtils.getRarity(frameType)];

  return (
    <>
      <TableCell
        className={classes.tableCell}
        key={column.id}
        align={column.numeric ? 'right' : 'left'}
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
                  <Box
                    position="relative"
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                    className={classes.iconImg}
                  >
                    {!iconLoaded && <CircularProgress size={20} />}
                    <img
                      className={classes.iconImg}
                      alt={value.toString()}
                      title={value.toString()}
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
            case 'corrupted':
              return (
                <span
                  style={{
                    color: itemColors.corrupted
                  }}
                >
                  {value ? (
                    <span
                      style={{
                        color: itemColors.corrupted
                      }}
                    >
                      {t(`tables:value.${value.toString()}`)}
                    </span>
                  ) : (
                    <span
                      style={{
                        color: theme.palette.primary.contrastText
                      }}
                    >
                      {t(`tables:value.${value.toString()}`)}
                    </span>
                  )}
                </span>
              );
            case 'total':
              return (
                <span
                  style={{
                    color: itemColors.chaosOrb
                  }}
                >
                  {tryParseNumber(value)}
                </span>
              );
            case 'calculated':
              return (
                <span
                  style={{
                    color: itemColors.chaosOrb
                  }}
                >
                  {tryParseNumber(value)}
                </span>
              );
            default:
              return (
                <>
                  {column.format && typeof value === 'number'
                    ? column.format(value)
                    : typeof value === 'boolean'
                    ? t(`tables:value.${value.toString()}`)
                    : value}
                </>
              );
          }
        })()}
      </TableCell>
    </>
  );
};

export default ItemTableCell;
