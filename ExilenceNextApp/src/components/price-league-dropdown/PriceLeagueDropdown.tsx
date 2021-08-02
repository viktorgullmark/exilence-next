import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Tooltip,
  IconButton,
} from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
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
        <Grid container>
          <Grid item xs={11}>
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
          </Grid>
          <Grid item xs={1} className={classes.icon}>
            <Tooltip
              placement="bottom-end"
              title={<span>{t('label.new_character_no_league_in_pricing_league')}</span>}
            >
              <IconButton>
                <HelpOutline />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
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
