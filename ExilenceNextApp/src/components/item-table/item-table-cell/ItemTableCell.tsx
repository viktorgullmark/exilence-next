import {
  Box,
  CircularProgress,
  IconButton,
  TableCell,
  Tooltip,
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  itemColors,
  rarityColors,
} from '../../../assets/themes/exilence-theme';
import { IColumn } from '../../../interfaces/column.interface';
import { getRarity } from '../../../utils/item.utils';
import useStyles from './ItemTableCell.styles';
import TimelineIcon from '@material-ui/icons/Timeline';
import { openCustomLink, openLink } from '../../../utils/window.utils';

interface ItemTableCellProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number | boolean;
  secondaryValue?: string;
  column: IColumn;
  frameType: number;
}

const ItemTableCell: React.FC<ItemTableCellProps> = ({
  value,
  secondaryValue,
  column,
  frameType,
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

  const noLinks = (value: number) => {
    return !value || value === 0;
  };

  const rarityColor = rarityColors[getRarity(frameType)];

  return (
    <>
      <TableCell
        className={clsx(classes.tableCell, {
          [classes.iconCell]: column.id === 'icon',
        })}
        key={column.id}
        align={column.numeric ? 'right' : 'left'}
      >
        <div>
          {(() => {
            switch (column.id) {
              case 'icon':
                return (
                  <div
                    style={{
                      borderLeft: `5px solid ${rarityColor}`,
                      background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, rgba(0,0,0,0) 100%)`,
                    }}
                    className={clsx({
                      [classes.iconCellInner]: column.id === 'icon',
                    })}
                  >
                    <Box
                      position='relative'
                      alignItems='center'
                      justifyContent='center'
                      display='flex'
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
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                  >
                    <span
                      style={{
                        color: rarityColor,
                      }}
                    >
                      {value}
                    </span>
                    {secondaryValue && (
                      <Tooltip
                        title={t('label.open_on_ninja')}
                        placement='bottom'
                      >
                        <IconButton
                          size='small'
                          className={classes.inlineIcon}
                          onClick={() => openCustomLink(secondaryValue)}
                        >
                          <TimelineIcon classes={{ root: classes.iconRoot }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                );
              case 'links':
                return (
                  <>
                    {typeof value === 'number' && (
                      <span
                        className={clsx({
                          [classes.noLinks]: noLinks(value),
                        })}
                      >
                        {noLinks(value) ? t('label.not_available') : value}
                      </span>
                    )}
                  </>
                );
              case 'corrupted':
                return (
                  <span
                    style={{
                      color: itemColors.corrupted,
                    }}
                  >
                    {value ? (
                      <span
                        style={{
                          color: itemColors.corrupted,
                        }}
                      >
                        {t(`tables:value.${value.toString()}`)}
                      </span>
                    ) : (
                      <span
                        style={{
                          color: theme.palette.primary.contrastText,
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
                    className={classes.lastCell}
                    style={{
                      color: itemColors.chaosOrb,
                    }}
                  >
                    {tryParseNumber(value)}
                  </span>
                );
              case 'calculated':
                return (
                  <span
                    style={{
                      color: itemColors.chaosOrb,
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
        </div>
      </TableCell>
    </>
  );
};

export default ItemTableCell;
