import { Checkbox, Chip, TextField, useTheme } from '@material-ui/core';
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
  touched: FormikTouched<any>;
  errors: FormikErrors<any>;
  stashTabs: IStashTab[];
  selectedStashTabs: IStashTab[];
  handleChange: (event: ChangeEvent<{}>) => void;
  handleStashTabChange: (value: IStashTab[]) => void;
}

const StashTabDropdown: React.FC<StashTabDropdownProps> = ({
  stashTabs,
  selectedStashTabs,
  handleChange,
  handleStashTabChange
}: StashTabDropdownProps) => {
  const theme = useTheme();
  const { t } = useTranslation(['tables']);
  const classes = useStyles();
  const [touched, setTouched] = useState(false);

  const getColour = (id: string) => {
    const foundTab = stashTabs.find(st => st.id === id);
    return foundTab
      ? rgbToHex(foundTab.colour.r, foundTab.colour.g, foundTab.colour.b)
      : '';
  };

  return (
    <div className={classes.formControl}>
      <Autocomplete
        multiple
        id="stash"
        options={stashTabs}
        disableCloseOnSelect
        defaultValue={selectedStashTabs}
        getOptionLabel={option => option.n}
        onChange={(e, value) => {
          handleChange(e);
          handleStashTabChange(value);
          setTouched(true);
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
    </div>
  );
};

export default observer(StashTabDropdown);
