import {
  TextField,
  makeStyles,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { AccountStore } from '../../../store/accountStore';
import { League } from '../../../store/domains/league';

interface LeagueSelectionStepProps {
  accountStore?: AccountStore;
  handleBack: Function;
  handleLeagueSubmit: Function;
  handleReset: Function;
  activeStep: number;
  styles: Record<string, string>;
}

interface LeagueFormValues {
  league: string;
  priceLeague: string;
}

const LeagueSelectionStep: React.FC<LeagueSelectionStepProps> = (
  props: LeagueSelectionStepProps
) => {
  const { t } = useTranslation();
  const [, setSubmitComplete] = useState(false);

  return (
    <Formik
      initialValues={{ league: '', priceLeague: '' }}
      onSubmit={(values: LeagueFormValues, { setSubmitting }: FormikActions<LeagueFormValues>
      ) => {
        setSubmitComplete(true);
        props.handleLeagueSubmit();
      }}
      validationSchema={Yup.object().shape({
        league: Yup.string().required('Required'),
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
                error={touched.league && errors.league != undefined}
              >
                <InputLabel htmlFor="league-dd">
                  {t('label.select_main_league')}
                </InputLabel>
                <Select
                  value={values.league}
                  onChange={handleChange}
                  inputProps={{
                    name: 'league',
                    id: 'league-dd'
                  }}
                >
                  {props.accountStore!.getSelectedAccount.leagues.map(
                    (league: League) => {
                      return (
                        <MenuItem key={league.uuid} value={league.id}>
                          {league.id}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
                {touched.league && errors.league && (
                  <FormHelperText error>
                    {errors.league && touched.league && errors.league}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl
                fullWidth
                margin="normal"
                error={touched.priceLeague && errors.priceLeague != undefined}
              >
                <InputLabel htmlFor="price-league-dd">
                  {t('label.select_main_league')}
                </InputLabel>
                <Select
                  value={values.priceLeague}
                  onChange={handleChange}
                  inputProps={{
                    name: 'priceLeague',
                    id: 'price-league-dd'
                  }}
                >
                  {props.accountStore!.getSelectedAccount.leagues.map(
                    (priceLeague: League) => {
                      return (
                        <MenuItem key={priceLeague.uuid} value={priceLeague.id}>
                          {priceLeague.id}
                        </MenuItem>
                      );
                    }
                  )}
                </Select>
                {touched.priceLeague && errors.priceLeague && (
                  <FormHelperText error>
                    {errors.priceLeague && touched.priceLeague && errors.priceLeague}
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
                disabled={isSubmitting}
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

export default inject('accountStore')(observer(LeagueSelectionStep));
