import FilterListIcon from '@mui/icons-material/FilterList';
import GetAppIcon from '@mui/icons-material/GetApp';
import ViewColumnsIcon from '@mui/icons-material/ViewColumn';
import {
  Box,
  Button,
  Grid,
  Stack,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import CompareIcon from '@mui/icons-material/Compare';
import UpdateIcon from '@mui/icons-material/Update';
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
import { useStores } from '../..';
import { statusColors } from '../../assets/themes/exilence-theme';
import { useLocalStorage } from '../../hooks/use-local-storage';
import { exportData } from '../../utils/export.utils';
import ColumnHidePage from '../column-hide-page/ColumnHidePage';
import { defaultColumn } from '../table-wrapper/DefaultColumn';
import TableWrapper from '../table-wrapper/TableWrapper';
import ItemTableFilterSubtotal from './item-table-filter-subtotal/ItemTableFilterSubtotal';
import ItemTableFilter from './item-table-filter/ItemTableFilter';
import ItemTableMenuContainer from './item-table-menu/ItemTableMenuContainer';
import itemTableBulkSellColumns from './itemTableBulkSellColumns';
import itemTableColumns from './itemTableColumns';
import itemTableGroupColumns from './itemTableGroupColumns';
import itemTableComparisonColumns from './itemTableComparisonColumns';

export const itemTableFilterSpacing = 2;

const useStyles = makeStyles((theme: Theme) => ({
  itemTableFilter: {},
  actionArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  placeholder: {
    display: 'flex',
    alignSelf: 'flex-end',
  },
  tableButton: {
    marginLeft: theme.spacing(1.5),
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
  itemTableSelectionGroup: {
    height: 36,
  },
  bulkSell: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginRight: 5,
    marginLeft: 5,
  },
  bulkSellImg: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  askingPrice: {
    display: 'flex',
    alignItems: 'center',
  },
  generatedAt: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(2),
  },
  askingPriceInput: {
    width: 100,
    marginRight: 5,
  },
  askingPriceGeneratedValue: {
    textTransform: 'none',
  },
}));

type ItemTableContainerProps = {
  bulkSellView?: boolean;
  searchFilterText: string;
};

const ItemTableContainer = ({
  bulkSellView = false,
  searchFilterText = '',
}: ItemTableContainerProps) => {
  const { accountStore, signalrStore, uiStateStore } = useStores();
  const activeProfile = accountStore!.getSelectedAccount.activeProfile;
  const { activeGroup } = signalrStore!;
  const classes = useStyles();
  const { t } = useTranslation();
  const getItems = useMemo(() => {
    if (activeProfile) {
      return activeGroup && !bulkSellView ? activeGroup.items : activeProfile.items;
    } else {
      return [];
    }
  }, [activeProfile, activeProfile?.items, activeGroup?.items, activeGroup]);

  const getColumns = useMemo(() => {
    if (activeGroup && !bulkSellView) return itemTableGroupColumns;
    if (!activeGroup && bulkSellView) return itemTableBulkSellColumns;
    if (uiStateStore.itemTableSelection === 'comparison') return itemTableComparisonColumns;
    return itemTableColumns;
  }, [activeGroup, uiStateStore.itemTableSelection]);

  const data = useMemo(() => {
    return getItems;
  }, [getItems, bulkSellView]);

  const [initialState, setInitialState] = bulkSellView
    ? useLocalStorage(`tableState:bulk-sell-item-table`, {
        pageSize: 50,
        hiddenColumns: uiStateStore!.bulkSellActivePreset?.hiddenColumns || [],
        sortBy: [{ id: 'total', desc: true }],
      })
    : useLocalStorage(`tableState:item-table`, {
        pageSize: 25,
        hiddenColumns: uiStateStore!.bulkSellActivePreset?.hiddenColumns || [],
      });

  const [instance] = useState<TableInstance<object>>(
    useTable(
      {
        columns: getColumns,
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

        bulkSellView
          ? uiStateStore!.setBulkSellItemTableFilterText(text)
          : uiStateStore!.setItemTableFilterText(text);
      },
      event ? 500 : 0
    );
  };

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const hideableColumns = getColumns.filter((column) => !(column.id === '_selector'));

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
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          {uiStateStore!.bulkSellGeneratingImage ? (
            <Grid item md={12} display="flex" flexDirection="row">
              <>
                <Grid item id="items-table-asking-price" className={classes.askingPrice}>
                  <Typography variant="body2">{t('label.asking_price')}</Typography>:&nbsp;
                  <Button
                    className={classes.askingPriceGeneratedValue}
                    size="small"
                    variant="contained"
                    color="primary"
                  >
                    {uiStateStore!.bulkSellAskingPrice}c (
                    {uiStateStore!.bulkSellAskingPricePercentage}% of original price)
                  </Button>
                </Grid>
                <Grid item id="items-table-generated" className={classes.generatedAt}>
                  <Typography variant="body2">{t('label.generated_at')}</Typography>&nbsp;
                  <b>
                    <u>{moment().utc().format('YYYY-MM-DD HH:MM')}</u>
                  </b>
                  &nbsp;
                  <Typography variant="body2">{t('label.generated_by')}.</Typography>&nbsp;
                  <Typography variant="body2">{t('label.powered_by_poe_ninja')}</Typography>
                </Grid>
              </>
            </Grid>
          ) : (
            <>
              <Grid item md={7}>
                <Stack spacing={2} display="flex" alignItems="center" direction="row">
                  <ToggleButtonGroup
                    className={classes.itemTableSelectionGroup}
                    value={uiStateStore.itemTableSelection}
                    exclusive
                    size="small"
                    onChange={(_, value) => {
                      if (value !== null) {
                        uiStateStore.setItemTableSelection(value);
                      }
                    }}
                    aria-label="text alignment"
                  >
                    <ToggleButton value="latest">
                      <Tooltip title={t('label.icon_latest') || ''} placement="bottom">
                        <UpdateIcon fontSize="small" />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="comparison">
                      <Tooltip title={t('label.icon_comparison') || ''} placement="bottom">
                        <CompareIcon fontSize="small" />
                      </Tooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <ItemTableFilter
                    array={getItems}
                    handleFilter={handleFilter}
                    clearFilter={() => handleFilter(undefined, '')}
                    searchText={searchFilterText}
                  />
                  <ItemTableFilterSubtotal array={getItems} />
                </Stack>
              </Grid>
              <Grid item className={classes.actionArea} id="items-table-actions" md={5}>
                {columnsOpen && (
                  <ColumnHidePage
                    instance={instance}
                    onClose={handleClose}
                    show={columnsOpen}
                    anchorEl={anchorEl}
                  />
                )}
                {hideableColumns.length > 1 && (
                  <Button
                    size="small"
                    className={classes.tableButton}
                    disabled={uiStateStore.itemTableSelection === 'comparison'}
                    variant="contained"
                    onClick={handleColumnsClick}
                    startIcon={<ViewColumnsIcon />}
                  >
                    {t('label.toggle_visible_columns')}
                  </Button>
                )}
                <Button
                  size="small"
                  className={classes.tableButton}
                  variant="contained"
                  disabled={uiStateStore.itemTableSelection === 'comparison'}
                  onClick={() =>
                    uiStateStore!.setShowItemTableFilter(!uiStateStore!.showItemTableFilter)
                  }
                  startIcon={<FilterListIcon />}
                >
                  {!uiStateStore!.showItemTableFilter
                    ? t('label.show_stash_tab_filter')
                    : t('label.disable_stash_tab_filter')}
                </Button>
                {!bulkSellView && (
                  <Button
                    size="small"
                    className={classes.tableButton}
                    variant="contained"
                    disabled={data.length === 0}
                    onClick={() => exportData(data)}
                    startIcon={<GetAppIcon />}
                  >
                    {t('label.toggle_export_menu')}
                  </Button>
                )}
              </Grid>
            </>
          )}
        </Grid>
      </Box>
      <TableWrapper instance={instance} setInitialState={setInitialState} />
      <ItemTableMenuContainer />
    </>
  );
};

export default observer(ItemTableContainer);
