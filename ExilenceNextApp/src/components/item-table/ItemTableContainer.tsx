import {
  Box,
  Grid,
  IconButton,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { inject, observer } from 'mobx-react';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  statusColors,
  primaryLighter
} from '../../assets/themes/exilence-theme';
import { ITableItem } from '../../interfaces/table-item.interface';
import { AccountStore } from '../../store/accountStore';
import { SignalrStore } from '../../store/signalrStore';
import { UiStateStore } from '../../store/uiStateStore';
import { mapPricedItemToTableItem } from '../../utils/item.utils';
import ItemTableFilter from './item-table-filter/ItemTableFilter';
import ItemTable, { Order } from './ItemTable';
import FilterListIcon from '@material-ui/icons/FilterList';

interface ItemTableContainerProps {
  uiStateStore?: UiStateStore;
  signalrStore?: SignalrStore;
  accountStore?: AccountStore;
}

export const itemTableFilterSpacing = 2;

const useStyles = makeStyles((theme: Theme) => ({
  itemTableFilter: {},
  actionArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end'
  },
  placeholder: {
    display: 'flex',
    alignSelf: 'flex-end'
  },
  inlineIcon: {
    color: primaryLighter
  },
  warning: {
    color: statusColors.warning
  },
  noItemPlaceholder: {
    color: theme.palette.primary.light
  },
  warningIcon: {
    color: statusColors.warning,
    marginLeft: theme.spacing(2)
  }
}));

const ItemTableContainer: React.FC<ItemTableContainerProps> = ({
  accountStore,
  signalrStore,
  uiStateStore
}: ItemTableContainerProps) => {
  const activeProfile = accountStore!.getSelectedAccount.activeProfile;
  const { activeGroup } = signalrStore!;
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();

  let timer: NodeJS.Timeout | undefined = undefined;

  const handleFilter = (
    event?: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    searchText?: string
  ) => {
    uiStateStore!.changeItemTablePage(0);
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

  const getItems = () => {
    if (activeProfile) {
      return activeGroup ? activeGroup.items : activeProfile.items;
    } else {
      return [];
    }
  };

  const toggleMore = () => {
    console.log('more');
  };

  return (
    <>
      <Box mb={itemTableFilterSpacing} className={classes.itemTableFilter}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item md={5}>
            <ItemTableFilter
              array={getItems()}
              handleFilter={handleFilter}
              clearFilter={() => handleFilter(undefined, '')}
            />
          </Grid>
          <Grid item className={classes.actionArea}>
            <IconButton
              className={classes.inlineIcon}
              onClick={() => uiStateStore!.setShowItemTableFilter(!uiStateStore!.showItemTableFilter)}
            >
              <FilterListIcon />
            </IconButton>
            <IconButton
              className={classes.inlineIcon}
              onClick={() => toggleMore()}
            >
              <MoreHorizIcon />
            </IconButton>
            {/* <Button
              color="primary"
              variant="contained"
              disabled={getItems().length === 0}
              onClick={() => exportData(getItems())}
            >
              {t('label.net_worth_export')}
            </Button> */}
          </Grid>
        </Grid>
      </Box>
      <ItemTable
        items={getItems().map(i => mapPricedItemToTableItem(i))}
        pageIndex={uiStateStore!.itemTablePageIndex}
        changePage={(i: number) => uiStateStore!.changeItemTablePage(i)}
        order={uiStateStore!.itemTableOrder}
        orderBy={uiStateStore!.itemTableOrderBy}
        setOrder={(order: Order) => uiStateStore!.setItemTableOrder(order)}
        setOrderBy={(col: keyof ITableItem) =>
          uiStateStore!.setItemTableOrderBy(col)
        }
      />
    </>
  );
};

export default inject(
  'uiStateStore',
  'signalrStore',
  'accountStore'
)(observer(ItemTableContainer));
