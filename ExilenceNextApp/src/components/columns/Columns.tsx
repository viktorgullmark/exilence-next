import { Box, IconButton, Tooltip, useTheme } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TimelineIcon from '@material-ui/icons/Timeline';
import clsx from 'clsx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from 'react-table';
import { itemColors, rarityColors } from '../../assets/themes/exilence-theme';
import { IPricedItem } from '../../interfaces/priced-item.interface';
import { ICompactTab } from '../../interfaces/stash.interface';
import { AccountStore } from '../../store/accountStore';
import { CustomPriceStore } from '../../store/customPriceStore';
import { UiStateStore } from '../../store/uiStateStore';
import { getRarity, parseTabNames } from '../../utils/item.utils';
import { getRawPriceFromPricedItem } from '../../utils/price.utils';
import { openCustomLink } from '../../utils/window.utils';
import useStyles from './Columns.styles';
export function itemIcon<T>(options: { accessor: string; header: string }): Column<object> {
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

export function itemName<T>(options: { accessor: string; header: string }): Column<object> {
  const { header, accessor } = options;

  return {
    Header: header,
    accessor,
    minWidth: 180,
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
  };
}

export function itemLinks<T>(options: { accessor: string; header: string }): Column<object> {
  const { header, accessor } = options;

  return {
    Header: header,
    accessor,
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

export function itemCorrupted<T>(options: { accessor: string; header: string }): Column<object> {
  const { header, accessor } = options;

  return {
    Header: header,
    accessor,
    // eslint-disable-next-line react/display-name
    Cell: (data: any) => {
      const value = data.row.values[accessor];
      return <ItemCorruptedCell value={value} />;
    },
  };
}

export function itemTabs<T>(options: { accessor: string; header: string }): Column<object> {
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

export function itemValue<T>(options: {
  accessor: string;
  header: string;
  editable?: boolean;
  placeholder?: string;
}): Column<object> {
  const { header, accessor, editable, placeholder } = options;

  return {
    Header: header,
    accessor,
    align: 'right',
    // eslint-disable-next-line react/display-name
    Cell: (data: any) => {
      const value = data.row.values[accessor];
      return (
        <ItemValueCell
          value={value}
          editable={editable}
          pricedItem={data.row.original}
          placeholder={placeholder}
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
          alt={value.toString()}
          title={value.toString()}
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
      <span
        style={{
          color: rarityColor,
        }}
      >
        {value}
      </span>
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
  uiStateStore?: UiStateStore;
  customPriceStore?: CustomPriceStore;
};

const ItemValueCellComponent = ({
  value,
  editable,
  pricedItem,
  uiStateStore,
  customPriceStore,
  placeholder,
}: ItemValueCellProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const tryParseNumber = (value: boolean | string | number) => {
    return typeof value === 'number' ? value.toFixed(2) : value;
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
          className={classes.lastCell}
          style={{
            color: itemColors.chaosOrb,
          }}
        >
          {value ? tryParseNumber(value) : placeholder}
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

const ItemValueCell = inject('uiStateStore', 'customPriceStore')(observer(ItemValueCellComponent));

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
  return <span>{parseTabNames(tabs)}</span>;
};
