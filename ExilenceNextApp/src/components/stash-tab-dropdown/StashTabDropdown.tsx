import React, { ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Chip, Popper, PopperProps, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { observer } from 'mobx-react';

import { IStashTab } from '../../interfaces/stash.interface';
import { rgbToHex } from './../../utils/colour.utils';
import useStyles from './StashTabDropdown.styles';

type StashTabDropdownProps = {
  stashTabs: IStashTab[];
  selectedStashTabs: IStashTab[];
  width?: number;
  size?: 'small' | 'medium';
  marginTop?: number;
  marginBottom?: number;
  labelKey?: string;
  placeholderKey?: string;
  hideLabel?: boolean;
  displayCountWarning?: boolean;
  handleChange?: (event: ChangeEvent<{}>) => void;
  handleStashTabChange: (event: ChangeEvent<{}>, value: IStashTab[]) => void;
};

const StashTabDropdown = ({
  stashTabs,
  selectedStashTabs,
  handleChange,
  width,
  marginTop,
  marginBottom,
  labelKey = 'common:label.select_stash_tabs',
  placeholderKey = 'common:label.add_stash_tabs',
  hideLabel,
  size = 'medium',
  displayCountWarning,
  handleStashTabChange,
}: StashTabDropdownProps) => {
  const { t } = useTranslation(['tables']);
  const classes = useStyles();
  let defaultValue: IStashTab[] = [];

  const getColour = (id: string) => {
    const foundTab = stashTabs.find((st) => st.id === id);
    return foundTab ? rgbToHex(foundTab.colour.r, foundTab.colour.g, foundTab.colour.b) : '';
  };

  useEffect(() => {
    defaultValue = [...selectedStashTabs];
  }, []);

  return (
    <Box mt={marginTop ? marginTop : 1} mb={marginBottom ? marginBottom : 2}>
      <Autocomplete
        multiple
        id="stash"
        options={stashTabs}
        size={size}
        style={{ width: width ? width : 'auto' }}
        value={selectedStashTabs}
        defaultValue={defaultValue}
        getOptionLabel={(option) => option.n}
        onChange={(e, value) => {
          if (handleChange) {
            handleChange(e);
          }
          handleStashTabChange(e, value);
        }}
        renderTags={(value: IStashTab[], getTagProps) =>
          value.map((option: IStashTab, index: number) => (
            <Chip
              variant="outlined"
              key={index}
              className={classes.chip}
              label={option.n}
              classes={{ label: classes.chipLabel }}
              style={{ border: `2px solid ${getColour(option.id)}` }}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={!hideLabel ? t(labelKey) : undefined}
            placeholder={t(placeholderKey)}
          />
        )}
        PopperComponent={CustomPopper}
      />
      {displayCountWarning && selectedStashTabs.length >= 10 && (
        <Box mt={1}>
          <Alert severity="warning">{t('common:label.stash_tab_count_warning')}</Alert>
        </Box>
      )}
    </Box>
  );
};

const CustomPopper = ({ children, ...other }: PopperProps) => (
  <Popper {...other}>{children}</Popper>
);

export default observer(StashTabDropdown);
