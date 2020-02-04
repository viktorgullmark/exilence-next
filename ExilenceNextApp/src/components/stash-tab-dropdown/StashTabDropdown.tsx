import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Theme,
  Typography,
  useTheme
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

interface StashTabDropdownProps {
  touched: FormikTouched<any>;
  errors: FormikErrors<any>;
  stashTabs: IStashTab[];
  stashTabIds: string[];
  handleChange: (event: ChangeEvent<{ value: unknown }>) => void;
  handleStashTabChange: (event: ChangeEvent<{ value: unknown }>) => void;
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
  stashTabIds,
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
      <FormControl
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
      </FormControl>
    </div>
  );
};

export default observer(StashTabDropdown);
