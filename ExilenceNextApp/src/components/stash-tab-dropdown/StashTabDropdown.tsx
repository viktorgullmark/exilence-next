import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Theme,
  Typography,
  useTheme,
  Checkbox,
  TextField
} from '@material-ui/core';
import { FormikErrors, FormikTouched } from 'formik';
import { observer } from 'mobx-react';
import React, { ChangeEvent, CSSProperties, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useLabelWidth from '../../hooks/use-label-width';
import useOffset from '../../hooks/use-popover-offset';
import { IStashTab } from '../../interfaces/stash.interface';
import { rgbToHex } from './../../utils/colour.utils';
import useStyles from './StashTabDropdown.styles';
import { useWindowSize } from '../../hooks/use-window-size';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

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
  selectedStashTabs,
  handleChange,
  handleStashTabChange
}: StashTabDropdownProps) => {
  const theme = useTheme();
  const { t } = useTranslation(['tables']);
  const classes = useStyles();
  const [touched, setTouched] = useState(false);

  const getStashTabName = (id: string) => {
    const foundTab = stashTabs.find(st => st.id === id);
    return foundTab ? foundTab.n : '';
  };

  const getColour = (id: string) => {
    const foundTab = stashTabs.find(st => st.id === id);
    return foundTab
      ? rgbToHex(foundTab.colour.r, foundTab.colour.g, foundTab.colour.b)
      : '';
  };
  const { labelWidth, ref } = useLabelWidth(0);

  const windowSize = useWindowSize();
  const offsetProps = useOffset(windowSize);

  return (
    <div ref={offsetProps.ref}>
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
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
        style={{ width: 500 }}
        renderInput={params => (
          <TextField
            {...params}
            variant="outlined"
            label="Checkboxes"
            placeholder="Favorites"
          />
        )}
      />
      {/* <FormControl
        variant="outlined"
        className={classes.formControl}
        fullWidth
        required
        margin="normal"
        error={touched && stashTabIds.length === 0}
      >
        <InputLabel ref={ref} id="mutiple-chip-label">
          {t('common:label.select_stash_tabs')}
        </InputLabel>
        <Select
          labelWidth={labelWidth}
          fullWidth
          labelId="mutiple-chip-label"
          id="mutiple-chip"
          multiple
          required
          value={stashTabIds}
          onChange={e => {
            handleChange(e);
            handleStashTabChange(e);
            setTouched(true);
          }}
          renderValue={selected => (
            <div className={classes.chips}>
              {(selected as string[]).map(value => (
                <Chip
                  key={value}
                  label={getStashTabName(value)}
                  className={classes.chip}
                  style={{ border: `3px solid ${getColour(value)}` }}
                />
              ))}
            </div>
          )}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250
              }
            },
            anchorPosition: {
              top: offsetProps.offset.top,
              left: offsetProps.offset.left
            },
            anchorReference: 'anchorPosition'
          }}
        >
          {stashTabs.length != 0 ? (
            stashTabs.map((stashTab: IStashTab) => (
              <MenuItem
                key={stashTab.id}
                value={stashTab.id}
                style={getStyles(stashTab.id, stashTabIds, theme)}
              >
                {stashTab.n}
              </MenuItem>
            ))
          ) : (
            <Typography component="h4">
              {t('label.stash_tab_dropdown_placeholder')}
            </Typography>
          )}
        </Select>
      </FormControl> */}
    </div>
  );
};

export default observer(StashTabDropdown);
