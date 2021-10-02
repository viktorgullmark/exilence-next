import { HelpOutline } from '@mui/icons-material';
import {
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import clsx from 'clsx';
import { FormikErrors, FormikTouched } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ILeagueFormValues } from '../../interfaces/league-form-values.interface';
import { League } from '../../store/domains/league';
import useStyles from './PriceLeagueDropdown.styles';

type PriceLeagueDropdownProps = {
  touched: FormikTouched<any>;
  errors: FormikErrors<any>;
  priceLeagues: League[];
  handleChange: (event: SelectChangeEvent<string>) => void;
  values: ILeagueFormValues;
  size?: 'small' | 'medium';
  margin?: 'dense' | 'normal';
  required?: boolean;
  helperIcon?: boolean;
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
  helperIcon,
}: PriceLeagueDropdownProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const label = t('label.select_price_league');
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
          {label}
        </InputLabel>
        <Grid container>
          <Grid item xs={helperIcon ? 11 : 12}>
            <Select
              fullWidth
              label={label}
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
          {helperIcon && (
            <Grid item xs={1} className={classes.icon}>
              <Tooltip
                placement="bottom-end"
                title={<span>{t('label.new_character_no_league_in_pricing_league')}</span>}
              >
                <IconButton size="large">
                  <HelpOutline />
                </IconButton>
              </Tooltip>
            </Grid>
          )}
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
