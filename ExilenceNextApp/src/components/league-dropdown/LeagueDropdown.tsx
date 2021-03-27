import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import { FormikErrors, FormikTouched } from 'formik';
import { observer } from 'mobx-react-lite';

import useLabelWidth from '../../hooks/use-label-width';
import { ILeagueFormValues } from '../../interfaces/league-form-values.interface';
import { League } from '../../store/domains/league';

type LeagueDropdownProps = {
  touched: FormikTouched<any>;
  errors: FormikErrors<any>;
  noCharacters: string;
  leagues: League[];
  handleLeagueChange: (event: ChangeEvent<{ value: unknown }>) => void;
  handleChange: (event: ChangeEvent<{ value: unknown }>) => void;
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
  const { labelWidth, ref } = useLabelWidth(0);

  return (
    <>
      <FormControl
        variant="outlined"
        fullWidth={fullWidth}
        margin={margin}
        required
        error={(touched.league && errors.league !== undefined) || noCharacters.length > 0}
      >
        {!hideLabel && (
          <InputLabel ref={ref} htmlFor="league-dd">
            {t('label.select_main_league')}
          </InputLabel>
        )}
        <Select
          labelWidth={labelWidth}
          fullWidth
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
