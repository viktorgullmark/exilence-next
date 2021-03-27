import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import clsx from 'clsx';
import { FormikErrors, FormikTouched } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ILeagueFormValues } from '../../interfaces/league-form-values.interface';
import { League } from '../../store/domains/league';
import useStyles from './PriceLeagueDropdown.styles';

type PriceLeagueDropdownProps = {
  touched: FormikTouched<any>;
  errors: FormikErrors<any>;
  priceLeagues: League[];
  handleChange: (event: ChangeEvent<{ value: unknown }>) => void;
  values: ILeagueFormValues;
  size?: 'small' | 'medium';
  margin?: 'dense' | 'normal';
  required?: boolean;
};

const PriceLeagueDropdown = ({
  touched,
  errors,
  priceLeagues,
  handleChange,
  values,
  size = 'medium',
  margin = 'normal',
  required = true,
}: PriceLeagueDropdownProps) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      <FormControl
        fullWidth
        variant="outlined"
        margin={margin}
        size={size}
        required={required}
        error={touched.priceLeague && errors.priceLeague !== undefined}
      >
        <InputLabel
          className={clsx({ [classes.small]: size === 'small' })}
          htmlFor="price-league-table-dd"
        >
          {t('label.select_price_league')}
        </InputLabel>
        <Select
          fullWidth
          labelWidth={141} // FIXME not sure why labelwidth is sometimes reset to 0 when using useLabelWidth
          value={values.priceLeague}
          onChange={(e) => handleChange(e)}
          classes={{
            root: size === 'small' ? classes.small : undefined,
          }}
          inputProps={{
            name: 'priceLeague',
            id: 'price-league-table-dd',
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
