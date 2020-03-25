import { Checkbox, Chip, TextField, useTheme, Box } from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FormikErrors, FormikTouched } from 'formik';
import { observer } from 'mobx-react';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IStashTab } from '../../interfaces/stash.interface';
import { rgbToHex } from './../../utils/colour.utils';
import useStyles from './StashTabDropdown.styles';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface StashTabDropdownProps {
  stashTabs: IStashTab[];
  selectedStashTabs: IStashTab[];
  width?: number;
  size?: 'small' | 'medium';
  marginTop?: number;
  marginBottom?: number;
  handleChange?: (event: ChangeEvent<{}>) => void;
  handleStashTabChange: (value: IStashTab[]) => void;
}

const StashTabDropdown: React.FC<StashTabDropdownProps> = ({
  stashTabs,
  selectedStashTabs,
  handleChange,
  width,
  marginTop,
  marginBottom,
  size = 'medium',
  handleStashTabChange
}: StashTabDropdownProps) => {
  const { t } = useTranslation(['tables']);
  const classes = useStyles();
  const theme = useTheme();

  const getColour = (id: string) => {
    const foundTab = stashTabs.find(st => st.id === id);
    return foundTab
      ? rgbToHex(foundTab.colour.r, foundTab.colour.g, foundTab.colour.b)
      : '';
  };

  return (
    <Box mt={marginTop ? marginTop : 1} mb={marginBottom ? marginBottom : 2}>
      <Autocomplete
        multiple
        id="stash"
        options={stashTabs}
        size={size}
        disableCloseOnSelect
        style={{ width: width ? width : 'auto' }}
        defaultValue={selectedStashTabs}
        getOptionLabel={option => option.n}
        onChange={(e, value) => {
          if (handleChange) {
            handleChange(e);
          }
          handleStashTabChange(value);
        }}
        renderOption={(option, { selected }) => (
          <React.Fragment>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.n}
          </React.Fragment>
        )}
        renderTags={(value: IStashTab[], getTagProps) =>
          value.map((option: IStashTab, index: number) => (
            <Chip
              variant="outlined"
              key={index}
              className={classes.chip}
              label={option.n}
              style={{ background: getColour(option.id) }}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label={t('common:label.select_stash_tabs')}
            placeholder={t('common:label.stash_tabs')}
          />
        )}
      />
    </Box>
  );
};

export default observer(StashTabDropdown);
