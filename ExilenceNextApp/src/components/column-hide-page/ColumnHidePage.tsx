import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Typography,
} from '@mui/material';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TableInstance } from 'react-table';
import { useStores } from '../..';
import SUPPORTED_PRESETS from '../bulk-sell-column-presets-panel/supportedPresets';
import useStyles from './ColumnHidePage.styles';

type ColumnHidePageProps = {
  instance: TableInstance;
  anchorEl: Element | null;
  onClose: () => void;
  show: boolean;
};

const id = 'popover-column-hide';

const ColumnHidePage = ({
  instance,
  anchorEl,
  onClose,
  show,
}: ColumnHidePageProps): ReactElement | null => {
  const {
    uiStateStore: {
      itemTableColumnPresets,
      setBulkSellActivePreset,
      bulkSellActivePreset,
      setItemtableColumnPresets,
    },
  } = useStores();
  const classes = useStyles();
  const { allColumns, toggleHideColumn, setHiddenColumns } = instance;

  const [hideableColumns, setHideableColumns] = useState(
    allColumns.filter((column) => !(column.id === '_selector'))
  );

  const [checkedCount, setCheckedCount] = useState(
    hideableColumns.reduce((acc, val) => acc + (val.isVisible ? 0 : 1), 0)
  );

  const { t } = useTranslation();
  const onlyOneOptionLeft = checkedCount + 1 >= hideableColumns.length;
  const onPresetSelect = (presetId: string) => {
    const foundPreset = itemTableColumnPresets.find((x) => x.name === presetId);
    if (foundPreset) {
      setBulkSellActivePreset(foundPreset);
    }
  };

  const onColumnChange = (id: string, isVisible: boolean) => {
    toggleHideColumn(id, isVisible);
    updateState();
    // todo: this code is fugly and should really be reworked, but hey it works
    runInAction(() => {
      const updatedPresets = itemTableColumnPresets.map((preset) => {
        if (preset.name === bulkSellActivePreset?.name) {
          const cols = hideableColumns.map((hc) => {
            if (hc.id === id) {
              hc.isVisible = !hc.isVisible;
            }
            return hc;
          });
          preset.hiddenColumns = cols
            .filter((hc) => !hc.isVisible)
            .map((hc) => {
              return hc.id;
            });
          setBulkSellActivePreset(preset);
        }
        return preset;
      });
      setItemtableColumnPresets(updatedPresets);
    });
  };

  const updateState = () => {
    setHideableColumns(allColumns.filter((column) => !(column.id === '_selector')));
    setCheckedCount(hideableColumns.reduce((acc, val) => acc + (val.isVisible ? 0 : 1), 0));
  };

  useEffect(() => {
    setHiddenColumns(bulkSellActivePreset?.hiddenColumns);
    updateState();
  }, [bulkSellActivePreset]);

  const label = t('label.select_column_preset');
  return hideableColumns.length > 1 ? (
    <div>
      <Popover
        anchorEl={anchorEl}
        className={classes.columnsPopOver}
        id={id}
        onClose={onClose}
        open={show}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className={classes.columnsPopOver}>
          <Typography className={classes.popoverTitle}>{t('label.visible_columns')}</Typography>
          <Box>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="column-preset-dd">{label}</InputLabel>
              <Select
                label={label}
                value={bulkSellActivePreset?.name}
                onChange={(e) => onPresetSelect(e.target.value as string)}
                displayEmpty
                fullWidth
                inputProps={{
                  name: 'column-preset',
                  id: 'column-preset-dd',
                }}
              >
                {SUPPORTED_PRESETS.map((option, i) => {
                  return (
                    <MenuItem key={i} value={option.name}>
                      {t(option.name)}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <div className={classes.grid}>
            {hideableColumns.map((column) => {
              return (
                <FormControlLabel
                  key={column.id}
                  control={
                    <Checkbox
                      color="primary"
                      value={`${column.id}`}
                      disabled={column.isVisible && onlyOneOptionLeft}
                    />
                  }
                  label={column.render('Header')}
                  checked={column.isVisible}
                  onChange={() => onColumnChange(column.id, column.isVisible)}
                />
              );
            })}
          </div>
        </div>
      </Popover>
    </div>
  ) : null;
};

export default observer(ColumnHidePage);
