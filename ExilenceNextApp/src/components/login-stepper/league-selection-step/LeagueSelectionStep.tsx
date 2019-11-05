import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { Character } from '../../../store/domains/character';
import { League } from '../../../store/domains/league';
import error from './../../../helpers/validation.helper';
import LeagueDropdown from '../../league-dropdown/LeagueDropdown';
import PriceLeagueDropdown from '../../price-league-dropdown/PriceLeagueDropdown';

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

export interface LeagueFormValues {
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
        league: Yup.string().required('Required'),
        priceLeague: Yup.string().required('Required')
      })}
    >
      {formProps => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleSubmit
        } = formProps;

        return (
          <form onSubmit={handleSubmit}>
            <div className={props.styles.stepMainContent}>
              <LeagueDropdown
                leagues={props.leagues}
                touched={touched}
                errors={errors}
                noCharacters={noCharacters}
                handleLeagueChange={(l: string) => props.handleLeagueChange(l)}
                handleChange={(e: any) => handleChange(e)}
                values={values}
              />
              <PriceLeagueDropdown
                priceLeagues={props.leagues}
                touched={touched}
                errors={errors}
                handleChange={(e: any) => handleChange(e)}
                values={values}
              />
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
