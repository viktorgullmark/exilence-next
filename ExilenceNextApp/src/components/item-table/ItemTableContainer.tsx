import { inject, observer } from 'mobx-react';
import React, { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { UiStateStore } from '../../store/uiStateStore';
import ItemTable from './ItemTable';
import { AccountStore } from '../../store/accountStore';
import ItemTableFilter from './item-table-filter/ItemTableFilter';
import { IPricedItem } from '../../interfaces/priced-item.interface';
import {
  Grid,
  Box,
  makeStyles,
  Theme,
  Button,
  Typography
} from '@material-ui/core';
import { reaction } from 'mobx';
import { ExportUtils } from '../../utils/export.utils';
import { useTranslation } from 'react-i18next';
import { statusColors } from '../../assets/themes/exilence-theme';
import { SignalrStore } from '../../store/signalrStore';
import WarningIcon from '@material-ui/icons/Warning';

interface ItemTableContainerProps {
  uiStateStore?: UiStateStore;
  signalrStore?: SignalrStore;
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
    justifyContent: 'flex-end',
    alignSelf: 'flex-end'
  },
  placeholder: {
    display: 'flex',
    alignSelf: 'flex-end'
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

  return (
    <>
      <Box mb={itemTableFilterSpacing} className={classes.itemTableFilter}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={4} md={3}>
            <ItemTableFilter array={getItems()} handleFilter={handleFilter} />
          </Grid>
          <Grid
            container
            item
            xs={4}
            md={6}
            className={classes.placeholder}
            direction="column"
            justify="space-between"
          >
            {getItems().length === 0 &&
              uiStateStore!.itemTableFilterText === '' && (
                <WarningIcon
                  titleAccess={t('label.no_snapshots_title')}
                  className={classes.warningIcon}
                />
              )}
          </Grid>

          <Grid item xs={4} md={3} className={classes.actionArea}>
            <Button
              color="primary"
              variant="contained"
              disabled={getItems().length === 0}
              onClick={() => ExportUtils.exportData(getItems())}
            >
              {t('label.net_worth_export')}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ItemTable
        items={getItems()}
        pageIndex={uiStateStore!.itemTablePageIndex}
        changePage={(i: number) => uiStateStore!.changeItemTablePage(i)}
      />
    </>
  );
};

export default inject(
  'uiStateStore',
  'signalrStore',
  'accountStore'
)(observer(ItemTableContainer));
