import {
  Box,
  Grid,
  IconButton,
  makeStyles,
  Theme,
  useTheme
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { inject, observer } from "mobx-react";
import React, { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  statusColors,
  primaryLighter
} from "../../assets/themes/exilence-theme";
import { ITableItem } from "../../interfaces/table-item.interface";
import { AccountStore } from "../../store/accountStore";
import { SignalrStore } from "../../store/signalrStore";
import { UiStateStore } from "../../store/uiStateStore";
import { mapPricedItemToTableItem } from "../../utils/item.utils";
import ItemTableFilter from "./item-table-filter/ItemTableFilter";
import ItemTableFilterSubtotal from "./item-table-filter-subtotal/ItemTableFilterSubtotal";
import ItemTable, { Order } from "./ItemTable";
import FilterListIcon from "@material-ui/icons/FilterList";
import ItemTableMenuContainer from "./item-table-menu/ItemTableMenuContainer";

interface ItemTableContainerProps {
  uiStateStore?: UiStateStore;
  signalrStore?: SignalrStore;
  accountStore?: AccountStore;
}

export const itemTableFilterSpacing = 2;

const useStyles = makeStyles((theme: Theme) => ({
  itemTableFilter: {},
  actionArea: {
    display: "flex",
    justifyContent: "flex-end",
    alignSelf: "flex-end"
  },
  placeholder: {
    display: "flex",
    alignSelf: "flex-end"
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
        let text = "";

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

  const handleItemTableMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    uiStateStore!.setItemTableMenuAnchor(event.currentTarget);
  };

  const itemArray = getItems();

  return (
    <>
      <Box mb={itemTableFilterSpacing} className={classes.itemTableFilter}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item md={7}>
            <Grid container direction="row" spacing={2} alignItems="center">
              <Grid item md={5}>
                <ItemTableFilter
                  array={itemArray}
                  handleFilter={handleFilter}
                  clearFilter={() => handleFilter(undefined, "")}
                />
              </Grid>
              <Grid item>
                <ItemTableFilterSubtotal array={itemArray} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.actionArea}>
            <IconButton
              size="small"
              className={classes.inlineIcon}
              onClick={() =>
                uiStateStore!.setShowItemTableFilter(
                  !uiStateStore!.showItemTableFilter
                )
              }
            >
              <FilterListIcon />
            </IconButton>
            <IconButton
              size="small"
              className={classes.inlineIcon}
              onClick={handleItemTableMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <ItemTable
        items={itemArray.map(i => mapPricedItemToTableItem(i))}
        pageIndex={uiStateStore!.itemTablePageIndex}
        changePage={(i: number) => uiStateStore!.changeItemTablePage(i)}
        order={uiStateStore!.itemTableOrder}
        orderBy={uiStateStore!.itemTableOrderBy}
        setOrder={(order: Order) => uiStateStore!.setItemTableOrder(order)}
        setOrderBy={(col: keyof ITableItem) =>
          uiStateStore!.setItemTableOrderBy(col)
        }
        activeGroup={activeGroup}
      />
      <ItemTableMenuContainer />
    </>
  );
};

export default inject(
  "uiStateStore",
  "signalrStore",
  "accountStore"
)(observer(ItemTableContainer));
