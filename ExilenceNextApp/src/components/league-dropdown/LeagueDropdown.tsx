import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { FormikErrors, FormikTouched } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ILeagueFormValues } from '../../interfaces/league-form-values.interface';
import { League } from '../../store/domains/league';

type LeagueDropdownProps = {
  touched: FormikTouched<any>;
  errors: FormikErrors<any>;
  noCharacters: string;
  leagues: League[];
  handleLeagueChange: (event: SelectChangeEvent<string>) => void;
  handleChange: (event: SelectChangeEvent<string>) => void;
  values: ILeagueFormValues;
  margin?: 'normal' | 'none' | 'dense' | undefined;
  fullWidth?: boolean;
  hideLabel?: boolean;
};

const LeagueDropdown = ({
  margin = 'normal',
  hideLabel = false,
  fullWidth,
  touched,
  errors,
  noCharacters,
  leagues,
  handleChange,
  handleLeagueChange,
  values,
}: LeagueDropdownProps) => {
  const { t } = useTranslation();
  const label = t('label.select_main_league');
  return (
    <>
      <FormControl
        variant="outlined"
        fullWidth={fullWidth}
        margin={margin}
        required
        error={(touched.league && errors.league !== undefined) || noCharacters.length > 0}
      >
        {!hideLabel && <InputLabel htmlFor="league-dd">{label}</InputLabel>}
        <Select
          fullWidth
          label={!hideLabel && label}
          value={values.league}
          onChange={(e) => {
            handleChange(e);
            handleLeagueChange(e);
          }}
          inputProps={{
            name: 'league',
            id: 'league-dd',
          }}
        >
          {leagues.map((league: League) => {
            return (
              <MenuItem key={league.uuid} value={league.id}>
                {league.id}
              </MenuItem>
            );
          })}
        </Select>
        {((touched.league && errors.league) || noCharacters) && (
          <FormHelperText error>
            {(errors.league && touched.league && errors.league) || noCharacters}
          </FormHelperText>
        )}
      </FormControl>
    </>
  );
};

export default observer(LeagueDropdown);
