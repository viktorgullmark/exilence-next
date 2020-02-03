import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import { FormikErrors, FormikTouched } from 'formik';
import { observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { League } from '../../store/domains/league';
import { ILeagueFormValues } from '../../interfaces/league-form-values.interface';
import useLabelWidth from '../../hooks/use-label-width';

interface PriceLeagueDropdownProps {
  touched: FormikTouched<any>;
  errors: FormikErrors<any>;
  priceLeagues: League[];
  handleChange: (event: ChangeEvent<{ value: unknown }>) => void;
  values: ILeagueFormValues;
}

const PriceLeagueDropdown: React.FC<PriceLeagueDropdownProps> = ({
  touched,
  errors,
  priceLeagues,
  handleChange,
  values
}: PriceLeagueDropdownProps) => {
  const { t } = useTranslation();
  const { labelWidth, ref } = useLabelWidth(0);

  return (
    <>
      <FormControl
        fullWidth
        variant="outlined"
        margin="normal"
        error={touched.priceLeague && errors.priceLeague !== undefined}
      >
        <InputLabel ref={ref} htmlFor="price-league-dd">
          {t('label.select_price_league')}
        </InputLabel>
        <Select
          fullWidth
          labelWidth={labelWidth}
          value={values.priceLeague}
          onChange={e => handleChange(e)}
          inputProps={{
            name: 'priceLeague',
            id: 'price-league-dd'
          }}
        >
          {priceLeagues.map((priceLeague: League) => {
            return (
              <MenuItem key={priceLeague.uuid} value={priceLeague.id}>
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
