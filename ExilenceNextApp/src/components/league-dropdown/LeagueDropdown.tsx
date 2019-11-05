import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import { FormikErrors, FormikTouched } from 'formik';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { League } from '../../store/domains/league';
import { LeagueFormValues } from '../login-stepper/league-selection-step/LeagueSelectionStep';

interface LeagueDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
    touched: FormikTouched<any>;
    errors: FormikErrors<any>;
    noCharacters: string;
    leagues: League[];
    handleLeagueChange: Function;
    handleChange: Function;
    values: LeagueFormValues;
}

const LeagueDropdown: React.FC<LeagueDropdownProps> = ({ touched, errors, noCharacters, leagues, handleChange, handleLeagueChange, values, children }: LeagueDropdownProps) => {
    const { t } = useTranslation();

    return (
    <>
      <FormControl
        fullWidth
        margin="normal"
        error={
          (touched.league && errors.league !== undefined) ||
          noCharacters.length > 0
        }
      >
        <InputLabel htmlFor="league-dd">
          {t('label.select_main_league')}
        </InputLabel>
        <Select
          value={values.league}
          onChange={e => {
            handleChange(e);
            handleLeagueChange(e.target.value);
          }}
          inputProps={{
            name: 'league',
            id: 'league-dd'
          }}
        >
          {leagues.map((league: League) => {
            return (
              <MenuItem key={league.uuid} value={league.uuid}>
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
