import { Box, Chip, Popper, PopperProps, TextField } from '@mui/material';
import { Alert } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IStashTab } from '../../interfaces/stash.interface';
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
    return foundTab ? foundTab.metadata.colour : '';
  };

  useEffect(() => {
    defaultValue = [...selectedStashTabs];
  }, []);

  return (
    <Box mt={marginTop ? marginTop : 1} mb={marginBottom ? marginBottom : 2}>
      <Autocomplete
        multiple
        disableCloseOnSelect
        id="stash"
        options={stashTabs}
        size={size}
        style={{ width: width ? width : 'auto' }}
        value={selectedStashTabs}
        defaultValue={defaultValue}
        getOptionLabel={(option) => option.name}
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
              label={option.name}
              classes={{ label: classes.chipLabel }}
              style={{ border: `2px solid #${getColour(option.id)}` }}
              {...getTagProps({ index })}
              key={`${option.id}-${index}`}
              className={classes.chip}
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
