import { inject, observer } from 'mobx-react';
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { UiStateStore } from '../../store/uiStateStore';
import ItemTable from './ItemTable';
import { AccountStore } from '../../store/accountStore';
import ItemTableFilter from './item-table-filter/ItemTableFilter';
import { IPricedItem } from '../../interfaces/priced-item.interface';
import { Grid, Box, makeStyles, Theme, Button } from '@material-ui/core';
import { reaction } from 'mobx';
import { ExportUtils } from '../../utils/export.utils';
import { useTranslation } from 'react-i18next';

interface ItemTableContainerProps {
  uiStateStore?: UiStateStore;
  accountStore?: AccountStore;
}

export const itemTableFilterHeight = 48;
export const itemTableFilterSpacing = 2;

const useStyles = makeStyles((theme: Theme) => ({
  itemTableFilter: {
    height: itemTableFilterHeight
  },
  actionArea: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}));

const ItemTableContainer: React.FC<ItemTableContainerProps> = ({
  accountStore,
  uiStateStore
}: ItemTableContainerProps) => {
  const { filteredItems } = accountStore!.getSelectedAccount.activeProfile;
  const { t } = useTranslation();
  const classes = useStyles();

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

  return (
    <>
      <Box mb={itemTableFilterSpacing} className={classes.itemTableFilter}>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item xs={3}>
            <ItemTableFilter
              array={filteredItems}
              handleFilter={handleFilter}
            />
          </Grid>
          <Grid item xs={3} className={classes.actionArea}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => ExportUtils.exportData(filteredItems)}
            >
              {t('label.net_worth_export')}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ItemTable
        items={filteredItems}
        pageIndex={uiStateStore!.itemTablePageIndex}
        changePage={(i: number) => uiStateStore!.changeItemTablePage(i)}
      />
    </>
  );
};

export default inject(
  'uiStateStore',
  'accountStore'
)(observer(ItemTableContainer));
