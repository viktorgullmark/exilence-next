import { Box, Grid, makeStyles, Theme } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { ChangeEvent, default as React, useMemo, useState } from 'react';
import {
  TableInstance,
  useColumnOrder,
  useFilters,
  useFlexLayout,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from 'react-table';
import { primaryLighter, statusColors } from '../../assets/themes/exilence-theme';
import { useLocalStorage } from '../../hooks/use-local-storage';
import { AccountStore } from '../../store/accountStore';
import { PriceStore } from '../../store/priceStore';
import { UiStateStore } from '../../store/uiStateStore';
import { excludeLegacyMaps } from '../../utils/price.utils';
import CustomPriceDialogContainer from '../custom-price-dialog/CustomPriceDialogContainer';
import { defaultColumn } from '../table-wrapper/DefaultColumn';
import TableWrapper from '../table-wrapper/TableWrapper';
import PriceTableFilter from './price-table-filter/PriceTableFilter';
import PriceTableLeagueDropdownContainer from './price-table-league-dropdown/PriceTableLeagueDropdownContainer';
import priceTableColumns from './priceTableColumns';

type PriceTableContainerProps = {
  uiStateStore?: UiStateStore;
  accountStore?: AccountStore;
  priceStore?: PriceStore;
};

export const priceTableFilterSpacing = 2;

const useStyles = makeStyles((theme: Theme) => ({
  priceTableFilter: {},
  actionArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  placeholder: {
    display: 'flex',
    alignSelf: 'flex-end',
  },
  inlineIcon: {
    color: primaryLighter,
  },
  warning: {
    color: statusColors.warning,
  },
  noItemPlaceholder: {
    color: theme.palette.primary.light,
  },
  warningIcon: {
    color: statusColors.warning,
    marginLeft: theme.spacing(2),
  },
}));

const PriceTableContainer = ({ priceStore, uiStateStore }: PriceTableContainerProps) => {
  const classes = useStyles();
  const prices = priceStore!.pricesWithCustomValues;
  const data = useMemo(() => {
    return excludeLegacyMaps(prices ? prices : []);
  }, [prices]);

  const tableName = 'price-table';
  const [initialState, setInitialState] = useLocalStorage(`tableState:${tableName}`, {});

  const [instance] = useState<TableInstance<object>>(
    useTable(
      {
        columns: priceTableColumns,
        defaultColumn,
        data,
        initialState,
      },
      useColumnOrder,
      useFilters,
      useSortBy,
      useFlexLayout,
      useResizeColumns,
      usePagination,
      (hooks) => {
        hooks.allColumns.push((columns) => [...columns]);
      }
    )
  );

  // FIXME: add useEffect() to clear timeout on dismounting
  let timer: NodeJS.Timeout | undefined = undefined;

  const handleFilter = (
    event?: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    searchText?: string
  ) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(
      () => {
        let text = '';

        if (event) {
          text = event.target.value.toLowerCase();
        }

        if (searchText) {
          text = searchText;
        }

        uiStateStore!.setPriceTableFilterText(text);
      },
      event ? 500 : 0
    );
  };

  return (
    <>
      <Box mb={priceTableFilterSpacing} className={classes.priceTableFilter}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item md={7}>
            <Grid container direction="row" spacing={2} alignItems="center">
              <Grid item md={6}>
                <PriceTableFilter
                  handleFilter={handleFilter}
                  clearFilter={() => handleFilter(undefined, '')}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={2} className={classes.actionArea}>
            <PriceTableLeagueDropdownContainer />
          </Grid>
        </Grid>
      </Box>
      <TableWrapper instance={instance} setInitialState={setInitialState} />
      <CustomPriceDialogContainer />
    </>
  );
};

export default inject('uiStateStore', 'priceStore')(observer(PriceTableContainer));
