import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import { FormikErrors, FormikTouched } from 'formik';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { League } from '../../store/domains/league';
import { LeagueFormValues } from '../login-stepper/league-selection-step/LeagueSelectionStep';

interface PriceLeagueDropdownProps {
  touched: FormikTouched<any>;
  errors: FormikErrors<any>;
  priceLeagues: League[];
  handleChange: Function;
  values: LeagueFormValues;
}

const PriceLeagueDropdown: React.FC<PriceLeagueDropdownProps> = ({
  touched,
  errors,
  priceLeagues,
  handleChange,
  values
}: PriceLeagueDropdownProps) => {
  const { t } = useTranslation();

  return (
    <>
      <FormControl
        fullWidth
        margin="normal"
        error={touched.priceLeague && errors.priceLeague !== undefined}
      >
        <InputLabel htmlFor="price-league-dd">
          {t('label.select_price_league')}
        </InputLabel>
        <Select
          value={values.priceLeague}
          onChange={e => handleChange(e)}
          inputProps={{
            name: 'priceLeague',
            id: 'price-league-dd'
          }}
        >
          {priceLeagues.map((priceLeague: League) => {
            return (
              <MenuItem key={priceLeague.uuid} value={priceLeague.uuid}>
                {priceLeague.id}
              </MenuItem>
            );
          })}
        </Select>
        {touched.priceLeague && errors.priceLeague && (
          <FormHelperText error>
            {errors.priceLeague && touched.priceLeague && errors.priceLeague}
          </FormHelperText>
        )}
      </FormControl>
    </>
  );
};

export default observer(PriceLeagueDropdown);
