import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Box, IconButton, Tooltip, useTheme } from '@mui/material';
import clsx from 'clsx';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from 'react-table';
import { useStores } from '../..';
import { itemColors, primaryLighter, rarityColors } from '../../assets/themes/exilence-theme';
import { ISparkLineDetails } from '../../interfaces/external-price.interface';
import { IPricedItem } from '../../interfaces/priced-item.interface';
import { ICompactTab } from '../../interfaces/stash.interface';
import { getRarity, parseTabNames } from '../../utils/item.utils';
import { formatSparklineChartData, getRawPriceFromPricedItem } from '../../utils/price.utils';
import { openCustomLink } from '../../utils/window.utils';
import SparklineChart from '../sparkline-chart/SparklineChart';
import useStyles from './Columns.styles';

export function itemIcon(options: { accessor: string; header: string }): Column<object> {
  const { header, accessor } = options;

  return {
    Header: header,
    accessor,
    minWidth: 100,
    // eslint-disable-next-line react/display-name
    Cell: (data: any) => {
      const value = data.row.values[accessor];
      return <ItemIconCell value={value} frameType={data.row.original.frameType} />;
    },
  };
}

export function itemName(
  options: { accessor: string; header: string },
  bulkSellView?: boolean
): Column<object> {
  const { header, accessor } = options;

  return {
    Header: header,
    minWidth: 120,
    accessor,
    ...(!bulkSellView && {
      // eslint-disable-next-line react/display-name
      Cell: (data: any) => {
        const value = data.row.values[accessor];
        return (
          <ItemNameCell
            value={value}
            frameType={data.row.original.frameType}
            poeNinjaUrl={data.row.original.detailsUrl}
          />
        );
      },
    }),
  };
}

export function itemLinks(options: { accessor: string; header: string }): Column<object> {
  const { header, accessor } = options;

  return {
    Header: header,
    accessor,
    maxWidth: 60,
    // eslint-disable-next-line react/display-name
    Cell: (data: any) => {
      const value = data.row.values[accessor];
      const noLinks = (value: number) => {
        return !value || value === 0;
      };
      return <ItemCell value={value} available={!noLinks(value)} />;
    },
  };
}

export function itemCell(options: {
  accessor: string;
  header: string;
  align?: string;
}): Column<object> {
  const { header, accessor, align } = options;

  return {
    Header: header,
    accessor,
    align,
    // eslint-disable-next-line react/display-name
    Cell: (data: any) => {
      const value = data.row.values[accessor];
      return <ItemCell value={value} available={value} />;
    },
  };
}

export function itemCorrupted(options: { accessor: string; header: string }): Column<object> {
  const { header, accessor } = options;

  return {
    Header: header,
    accessor,
    minWidth: 60,
    // eslint-disable-next-line react/display-name
    Cell: (data: any) => {
      const value = data.row.values[accessor];
      return <ItemCorruptedCell value={value} />;
    },
  };
}

export function itemIlvlTier(options: {
  accessor: (row: any) => string | number | null | undefined;
  header: string;
}): Column<object> {
  const { header, accessor } = options;

  return {
    Header: header,
    accessor,
    align: 'right',
    maxWidth: 60,
    // eslint-disable-next-line react/display-name
    Cell: (row: any) => {
      return <span>{row.value}</span>;
    },
  };
}

export function itemTabs(options: { accessor: string; header: string }): Column<object> {
  const { header, accessor } = options;

  return {
    Header: header,
    accessor,
    // eslint-disable-next-line react/display-name
    Cell: (data: any) => {
      const value = data.row.values[accessor];
      return <ItemTabsCell tabs={value ? value : ''} />;
    },
  };
}

export function itemQuantity(options: {
  accessor: string;
  header: string;
  diff?: boolean;
}): Column<object> {
  const { header, accessor, diff } = options;

  return {
    Header: header,
    accessor,
    align: 'right',
    sortType: 'basic',
    maxWidth: 80,
    // eslint-disable-next-line react/display-name
    Cell: (data: any) => {
      const value = data.row.values[accessor];
      return <ItemQuantityCell quantity={value} diff={diff} />;
    },
  };
}

export function sparkLine(options: { accessor: string; header: string }): Column<object> {
  const { header, accessor } = options;

  return {
    Header: header,
    accessor,
    align: 'right',
    maxWidth: 190,
    sortType: 'basic',
    minWidth: 190,
    width: 190,
    disableResizing: true,
    // eslint-disable-next-line react/display-name
    Cell: (data: any) => {
      const value = data.row.original['sparkLine'];
      return <SparklineCell sparkline={value} id={data.row.id} />;
    },
  };
}

export function itemValue(options: {
  accessor?: string;
  header: string;
  editable?: boolean;
  placeholder?: string;
  cumulative?: boolean;
  diff?: boolean;
}): Column<object> {
  const { header, accessor, editable, placeholder, cumulative, diff } = options;

  return {
    Header: header,
    accessor,
    align: 'right',
    sortType: 'basic',
    // eslint-disable-next-line react/display-name
    Cell: (data: any) => {
      let value = 0;
      if (cumulative) {
        value = data.row.original.total;
        for (let i = 0; i < data.sortedRows.length; i++) {
          if (data.sortedRows[i].id === data.row.id) {
            break;
          }
          value += data.sortedRows[i].original.total;
        }
      } else if (accessor) {
        value = data.row.values[accessor];
      }
      return (
        <ItemValueCell
          value={value}
          editable={editable}
          pricedItem={data.row.original}
          placeholder={placeholder}
          diff={diff}
        />
      );
    },
  };
}

type ItemIconCellProps = {
  value: string;
  frameType: number;
};

const ItemIconCell = ({ value, frameType }: ItemIconCellProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();
  const rarityColor = rarityColors[getRarity(frameType)];

  return (
    <div
      style={{
        borderLeft: `5px solid ${rarityColor}`,
        background: `linear-gradient(90deg, ${theme.palette.background.paper} 0%, rgba(0,0,0,0) 100%)`,
      }}
      className={classes.iconCellInner}
    >
      <Box
        position="relative"
        alignItems="center"
        justifyContent="center"
        display="flex"
        className={classes.iconImg}
      >
        <img
          className={classes.iconImg}
          alt={t('label.icon_fetched_from')}
          src={typeof value === 'string' ? value : ''}
        />
      </Box>
    </div>
  );
};

type ItemNameCellProps = {
  value: string;
  frameType: number;
  poeNinjaUrl?: string;
};

const ItemNameCell = ({ value, frameType, poeNinjaUrl }: ItemNameCellProps) => {
  const classes = useStyles();
  const rarityColor = rarityColors[getRarity(frameType)];
  const { t } = useTranslation();

  return (
    <Box display="flex" width={1} alignItems="center" justifyContent="space-between">
      <Tooltip title={value || ''} placement="bottom">
        <span
          style={{
            color: rarityColor,
          }}
          className={classes.ellipsis}
        >
          {value}
        </span>
      </Tooltip>
      {poeNinjaUrl && (
        <Tooltip title={t('label.open_on_ninja') || ''} placement="bottom">
          <IconButton
            size="small"
            className={classes.inlineIcon}
            onClick={() => openCustomLink(poeNinjaUrl)}
          >
            <TimelineIcon classes={{ root: classes.iconRoot }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

type ItemCellProps = {
  value: string | number;
  available?: boolean;
};

const ItemCell = ({ value, available }: ItemCellProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <span
      className={clsx({
        [classes.unavailable]: !available,
      })}
    >
      {!available ? t('label.not_available') : value}
    </span>
  );
};

type ItemValueCellProps = {
  value: number;
  editable?: boolean;
  pricedItem: IPricedItem;
  placeholder?: string;
  diff?: boolean;
};

const ItemValueCellComponent = ({
  value,
  editable,
  pricedItem,
  placeholder,
  diff,
}: ItemValueCellProps) => {
  const { uiStateStore, customPriceStore } = useStores();

  const classes = useStyles();
  const { t } = useTranslation();
  const tryParseNumber = (value: boolean | string | number, diff?: boolean) => {
    return typeof value === 'number'
      ? `${diff && value > 0 ? '+ ' : ''}${value.toFixed(2)}`
      : value;
  };

  const toggleCustomPriceDialog = () => {
    uiStateStore!.setCustomPriceDialogOpen(true, pricedItem);
  };

  const removeCustomPrice = () => {
    const activeLeagueId = uiStateStore!.selectedPriceTableLeagueId;
    if (activeLeagueId) {
      customPriceStore!.removeCustomPrice(getRawPriceFromPricedItem(pricedItem), activeLeagueId);
    }
  };

  return (
    <>
      {value ? (
        <span
          className={clsx(classes.itemValue, classes.lastCell, {
            [classes.positiveChange]: diff && value > 0,
            [classes.negativeChange]: diff && value < 0,
          })}
        >
          {value ? tryParseNumber(value, diff) : placeholder}
        </span>
      ) : (
        <span className={classes.lastCell}>{placeholder}</span>
      )}
      {editable && (
        <>
          <Tooltip title={t('label.set_custom_price') || ''} placement="bottom">
            <IconButton
              size="small"
              className={classes.inlineIcon}
              onClick={toggleCustomPriceDialog}
            >
              <EditIcon classes={{ root: classes.editIconRoot }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('label.remove_custom_price') || ''} placement="bottom">
            <>
              <IconButton
                disabled={!value}
                size="small"
                className={classes.inlineIcon}
                onClick={removeCustomPrice}
              >
                <DeleteIcon classes={{ root: classes.editIconRoot }} />
              </IconButton>
            </>
          </Tooltip>
        </>
      )}
    </>
  );
};

const ItemValueCell = observer(ItemValueCellComponent);

type ItemCorruptedCellProps = {
  value: boolean;
};

const ItemCorruptedCell = ({ value }: ItemCorruptedCellProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

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
          {t(`tables:value.false`)}
        </span>
      )}
    </span>
  );
};

type ItemTabsCellProps = {
  tabs: ICompactTab[];
};

const ItemTabsCell = ({ tabs }: ItemTabsCellProps) => {
  const classes = useStyles();
  const value = tabs ? parseTabNames(tabs) : '';
  return (
    <Tooltip title={value} placement="bottom">
      <span className={classes.ellipsis}>{value}</span>
    </Tooltip>
  );
};

type ItemQuantityCellProps = {
  quantity: number;
  diff?: boolean;
};

const ItemQuantityCell = ({ quantity, diff }: ItemQuantityCellProps) => {
  const classes = useStyles();
  return (
    <span
      className={clsx({
        [classes.positiveChange]: diff && quantity > 0,
        [classes.negativeChange]: diff && quantity < 0,
      })}
    >
      {diff && quantity > 0 ? '+ ' : ''}
      {quantity}
    </span>
  );
};

type SparklineCellProps = {
  id: string;
  sparkline?: ISparkLineDetails;
};

const SparklineCell = ({ sparkline, id }: SparklineCellProps) => {
  const classes = useStyles();
  const data = sparkline ? formatSparklineChartData(sparkline.data) : undefined;
  return (
    <>
      {data && (
        <Box display="flex" width={1} alignItems="center" justifyContent="space-between">
          <SparklineChart
            internalName={id}
            color={primaryLighter}
            height={25}
            width={90}
            domainPadding={{ x: 1, y: 1 }}
            data={data}
          />
          <span
            className={clsx(classes.ellipsis, {
              [classes.positiveChange]: sparkline && sparkline.totalChange > 0,
              [classes.negativeChange]: sparkline && sparkline.totalChange < 0,
            })}
          >
            {sparkline?.totalChange} %
          </span>
        </Box>
      )}
    </>
  );
};
