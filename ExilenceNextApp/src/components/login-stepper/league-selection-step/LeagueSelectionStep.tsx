import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { Character } from '../../../store/domains/character';
import { League } from '../../../store/domains/league';
import error from './../../../helpers/validation.helper';

interface LeagueSelectionStepProps {
  handleBack: Function;
  handleLeagueSubmit: Function;
  handleLeagueChange: Function;
  handleReset: Function;
  activeStep: number;
  styles: Record<string, string>;
  selectedLeague?: string;
  selectedPriceLeague?: string;
  leagues: League[];
  priceLeagues: League[];
  characters: Character[];
}

interface LeagueFormValues {
  league?: string;
  priceLeague?: string;
}

const LeagueSelectionStep: React.FC<LeagueSelectionStepProps> = (
  props: LeagueSelectionStepProps
) => {
  const { t } = useTranslation();
  const noCharacters = t(error.noCharacters(props.characters));
  return (
    <Formik
      initialValues={{
        league: props.selectedLeague,
        priceLeague: props.selectedPriceLeague
      }}
      onSubmit={(
        values: LeagueFormValues,
        { setSubmitting }: FormikActions<LeagueFormValues>
      ) => {
        props.handleLeagueSubmit();
      }}
      validationSchema={Yup.object().shape({
        league: Yup.string()
          .required('Required'),
        priceLeague: Yup.string().required('Required')
      })}
    >
      {formProps => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset
        } = formProps;

        return (
          <form onSubmit={handleSubmit}>
            <div className={props.styles.stepMainContent}>
              <FormControl
                fullWidth
                margin="normal"
                error={(touched.league && errors.league != undefined) || noCharacters.length > 0}
              >
                <InputLabel htmlFor="league-dd">
                  {t('label.select_main_league')}
                </InputLabel>
                <Select
                  value={values.league}
                  onChange={e => {
                    handleChange(e);
                    props.handleLeagueChange(e.target.value);
                  }}
                  inputProps={{
                    name: 'league',
                    id: 'league-dd'
                  }}
                >
                  {props.leagues.map((league: League) => {
                    return (
                      <MenuItem key={league.uuid} value={league.uuid}>
                        {league.id}
                      </MenuItem>
                    );
                  })}
                </Select>
                {(touched.league && errors.league) || noCharacters && (
                  <FormHelperText error>
                    {(errors.league && touched.league && errors.league) || noCharacters}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl
                fullWidth
                margin="normal"
                error={touched.priceLeague && errors.priceLeague != undefined}
              >
                <InputLabel htmlFor="price-league-dd">
                  {t('label.select_price_league')}
                </InputLabel>
                <Select
                  value={values.priceLeague}
                  onChange={handleChange}
                  inputProps={{
                    name: 'priceLeague',
                    id: 'price-league-dd'
                  }}
                >
                  {props.priceLeagues.map((priceLeague: League) => {
                    return (
                      <MenuItem key={priceLeague.uuid} value={priceLeague.uuid}>
                        {priceLeague.id}
                      </MenuItem>
                    );
                  })}
                </Select>
                {touched.priceLeague && errors.priceLeague && (
                  <FormHelperText error>
                    {errors.priceLeague &&
                      touched.priceLeague &&
                      errors.priceLeague}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div className={props.styles.stepFooter}>
              <Button
                disabled={props.activeStep === 0 || isSubmitting}
                onClick={() => props.handleBack()}
              >
                {t('action.back')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting || noCharacters.length > 0}
              >
                {t('action.next')}
              </Button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default observer(LeagueSelectionStep);
