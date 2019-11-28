import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  InputLabel,
  makeStyles,
  Theme
} from '@material-ui/core';
import { FormikErrors, FormikTouched } from 'formik';
import { observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { League } from '../../store/domains/league';
import { LeagueFormValues } from '../league-selection-form/LeagueSelectionForm';

interface LeagueDropdownProps {
  touched: FormikTouched<any>;
  errors: FormikErrors<any>;
  noCharacters: string;
  leagues: League[];
  handleLeagueChange: (event: ChangeEvent<{ value: unknown; }>) => void;
  handleChange: (event: ChangeEvent<{ value: unknown; }>) => void;
  values: LeagueFormValues;
  margin?: 'normal' | 'none' | 'dense' | undefined;
  fullWidth?: boolean;
  hideLabel?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
}));

const LeagueDropdown: React.FC<LeagueDropdownProps> = ({
  margin = 'normal',
  hideLabel = false,
  fullWidth,
  touched,
  errors,
  noCharacters,
  leagues,
  handleChange,
  handleLeagueChange,
  values
}: LeagueDropdownProps) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      <FormControl
        fullWidth={fullWidth}
        margin={margin}
        error={
          (touched.league && errors.league !== undefined) ||
          noCharacters.length > 0
        }
      >
        {!hideLabel && (
          <InputLabel htmlFor="league-dd">
            {t('label.select_main_league')}
          </InputLabel>
        )}
        <Select
          value={values.league}
          onChange={e => {
            handleChange(e);
            handleLeagueChange(e);
          }}
          inputProps={{
            name: 'league',
            id: 'league-dd'
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
