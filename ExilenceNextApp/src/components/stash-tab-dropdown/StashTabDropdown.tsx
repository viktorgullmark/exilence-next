import {
  Chip,
  createStyles,
  FormControl,
  Input,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  Theme,
  useTheme,
} from '@material-ui/core';
import { FormikErrors, FormikTouched } from 'formik';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IStashTab } from '../../interfaces/stash.interface';
import { ProfileFormValues } from './../profile-dialog/ProfileDialog';

interface StashTabDropdownProps {
  touched: FormikTouched<any>;
  errors: FormikErrors<any>;
  stashTabs: IStashTab[];
  handleChange: Function;
  values: ProfileFormValues;
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
  stashTabs
}: StashTabDropdownProps) => {

  const theme = useTheme();
  const { t } = useTranslation();
  const classes = useStyles();
  const [stashTabIds, setStashTabIds] = React.useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStashTabIds(event.target.value as string[]);
  };

  const getStashTabName = (id: string) => {
    return stashTabs.find(st => st.id === id)!.n;
  };

  return (
    <>
      <FormControl className={classes.formControl} fullWidth margin="normal">
        <InputLabel id="mutiple-chip-label">{t('label.select_stash_tabs')}</InputLabel>
        <Select
          labelId="mutiple-chip-label"
          id="mutiple-chip"
          multiple
          value={stashTabIds}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div className={classes.chips}>
              {(selected as string[]).map(value => (
                <Chip key={value} label={getStashTabName(value)} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {stashTabs.map((stashTab: IStashTab) => (
            <MenuItem
              key={stashTab.id}
              value={stashTab.id}
              style={getStyles(stashTab.id, stashTabIds, theme)}
            >
              {stashTab.n}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default observer(StashTabDropdown);
