import { Chip, createStyles, FormControl, Input, InputLabel, makeStyles, MenuItem, Select, Theme, useTheme } from '@material-ui/core';
import { FormikErrors, FormikTouched } from 'formik';
import { observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ColourUtils } from '../../utils/colour.utils';
import { IStashTab } from '../../interfaces/stash.interface';

interface StashTabDropdownProps {
  touched: FormikTouched<any>;
  errors: FormikErrors<any>;
  stashTabs: IStashTab[];
  stashTabIds: string[];
  handleChange: (event: ChangeEvent<{ value: unknown; }>) => void;
  handleStashTabChange: (event: ChangeEvent<{ value: unknown; }>) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      minWidth: 120
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    chip: {
      margin: 2
    },
    noLabel: {
      marginTop: theme.spacing(3)
    }
  })
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};
function getStyles(name: string, stashTabIds: string[], theme: Theme) {
  return {
    fontWeight:
    stashTabIds.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

const StashTabDropdown: React.FC<StashTabDropdownProps> = ({
  stashTabs,
  stashTabIds,
  handleChange,
  handleStashTabChange
}: StashTabDropdownProps) => {

  const theme = useTheme();
  const { t } = useTranslation(['tables']);
  const classes = useStyles();

  const getStashTabName = (id: string) => {
    const foundTab = stashTabs.find(st => st.id === id);
    return foundTab ? foundTab.n : '';
  };

  const getColour = (id: string) => {
    const foundTab = stashTabs.find(st => st.id === id);
    return foundTab ? ColourUtils.rgbToHex(foundTab.colour.r, foundTab.colour.g, foundTab.colour.b) : '';
  }

  return (
    <>
      <FormControl className={classes.formControl} fullWidth margin="normal">
        <InputLabel id="mutiple-chip-label">{t('common:label.select_stash_tabs')}</InputLabel>
        <Select
          labelId="mutiple-chip-label"
          id="mutiple-chip"
          multiple
          value={stashTabIds}
          onChange={e => {
            handleChange(e);
            handleStashTabChange(e);
          }}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div className={classes.chips}>
              {(selected as string[]).map(value => (
                <Chip key={value} label={getStashTabName(value)} className={classes.chip} style={{ border: `3px solid ${getColour(value)}`}} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {stashTabs.length != 0 ? stashTabs.map((stashTab: IStashTab) => (
            <MenuItem
              key={stashTab.id}
              value={stashTab.id}
              style={getStyles(stashTab.id, stashTabIds, theme)}
            >
              {stashTab.n}
            </MenuItem>
          )) : <h2>{t('label.stash_tab_dropdown_placeholder')}</h2>}
        </Select>
      </FormControl>
    </>
  );
};

export default observer(StashTabDropdown);
