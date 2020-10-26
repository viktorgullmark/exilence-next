import { Box, Grid, IconButton, makeStyles, Theme, Tooltip } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import GetAppIcon from '@material-ui/icons/GetApp';
import ViewColumnsIcon from '@material-ui/icons/ViewColumn';
import { inject, observer } from 'mobx-react';
import { ChangeEvent, default as React, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TableInstance,
  useColumnOrder,
  useFilters,
  useFlexLayout,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import { primaryLighter, statusColors } from '../../assets/themes/exilence-theme';
import { useLocalStorage } from '../../hooks/use-local-storage';
import { AccountStore } from '../../store/accountStore';
import { SignalrStore } from '../../store/signalrStore';
import { UiStateStore } from '../../store/uiStateStore';
import { ColumnHidePage } from '../column-hide-page/ColumnHidePage';
import { defaultColumn } from '../table-wrapper/DefaultColumn';
import TableWrapper from '../table-wrapper/TableWrapper';
import ItemTableFilterSubtotal from './item-table-filter-subtotal/ItemTableFilterSubtotal';
import ItemTableFilter from './item-table-filter/ItemTableFilter';
import ItemTableMenuContainer from './item-table-menu/ItemTableMenuContainer';
import itemTableColumns from './itemTableColumns';

type ItemTableContainerProps = {
  uiStateStore?: UiStateStore;
  signalrStore?: SignalrStore;
  accountStore?: AccountStore;
};

export const itemTableFilterSpacing = 2;

const useStyles = makeStyles((theme: Theme) => ({
  itemTableFilter: {},
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

const ItemTableContainer = ({
  accountStore,
  signalrStore,
  uiStateStore,
}: ItemTableContainerProps) => {
  const activeProfile = accountStore!.getSelectedAccount.activeProfile;
  const { activeGroup } = signalrStore!;
  const classes = useStyles();
  const { t } = useTranslation();
  const getItems = useMemo(() => {
    if (activeProfile) {
      return activeGroup ? activeGroup.items : activeProfile.items;
    } else {
      return [];
    }
  }, [activeProfile, activeProfile?.items, activeGroup?.items, activeGroup]);

  const data = useMemo(() => {
    return getItems;
  }, [getItems]);

  const tableName = 'item-table';
  const [initialState, setInitialState] = useLocalStorage(`tableState:${tableName}`, {});

  const [instance] = useState<TableInstance<object>>(
    useTable(
      {
        columns: itemTableColumns,
        defaultColumn,
        data,
        initialState,
      },
      useColumnOrder,
      useFilters,
      useSortBy,
      useFlexLayout,
      usePagination,
      useResizeColumns,
      useRowSelect,
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

        uiStateStore!.setItemTableFilterText(text);
      },
      event ? 500 : 0
    );
  };

  const handleItemTableMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    uiStateStore!.setItemTableMenuAnchor(event.currentTarget);
  };
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [columnsOpen, setColumnsOpen] = useState(false);

  const hideableColumns = itemTableColumns.filter((column) => !(column.id === '_selector'));

  const handleColumnsClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setColumnsOpen(true);
    },
    [setAnchorEl, setColumnsOpen]
  );

  const handleClose = useCallback(() => {
    setColumnsOpen(false);
    setAnchorEl(null);
  }, []);

  return (
    <>
      <Box mb={itemTableFilterSpacing} className={classes.itemTableFilter}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item md={7}>
            <Grid container direction="row" spacing={2} alignItems="center">
              <Grid item md={5}>
                <ItemTableFilter
                  array={getItems}
                  handleFilter={handleFilter}
                  clearFilter={() => handleFilter(undefined, '')}
                />
              </Grid>
              <Grid item>
                <ItemTableFilterSubtotal array={getItems} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.actionArea}>
            <ColumnHidePage
              instance={instance}
              onClose={handleClose}
              show={columnsOpen}
              anchorEl={anchorEl}
            />
            {hideableColumns.length > 1 && (
              <Tooltip title={t('label.toggle_visible_columns') || ''} placement="bottom">
                <IconButton
                  size="small"
                  className={classes.inlineIcon}
                  onClick={handleColumnsClick}
                >
                  <ViewColumnsIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={t('label.toggle_stash_tab_filter') || ''} placement="bottom">
              <IconButton
                size="small"
                className={classes.inlineIcon}
                onClick={() =>
                  uiStateStore!.setShowItemTableFilter(!uiStateStore!.showItemTableFilter)
                }
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('label.toggle_export_menu') || ''} placement="bottom">
              <IconButton
                size="small"
                className={classes.inlineIcon}
                onClick={handleItemTableMenuOpen}
              >
                <GetAppIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
      <TableWrapper instance={instance} setInitialState={setInitialState} />
      <ItemTableMenuContainer />
    </>
  );
};

export default inject('uiStateStore', 'signalrStore', 'accountStore')(observer(ItemTableContainer));
