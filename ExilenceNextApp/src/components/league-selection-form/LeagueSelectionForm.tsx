import { Button } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { Character } from '../../store/domains/character';
import { League } from '../../store/domains/league';
import error from '../../utils/validation.utils';
import LeagueDropdown from '../league-dropdown/LeagueDropdown';
import PriceLeagueDropdown from '../price-league-dropdown/PriceLeagueDropdown';


interface LeagueSelectionFormProps {
  handleLeagueSubmit: () => void;
  handleLeagueChange: (event: ChangeEvent<{ value: unknown; }>) => void;
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

const LeagueSelectionForm: React.FC<LeagueSelectionFormProps> = (
  props: LeagueSelectionFormProps
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
                fullWidth
                noCharacters={noCharacters}
                handleLeagueChange={props.handleLeagueChange}
                handleChange={handleChange}
                values={values}
              />
              <PriceLeagueDropdown
                priceLeagues={props.leagues}
                touched={touched}
                errors={errors}
                handleChange={handleChange}
                values={values}
              />
            </div>
            <div className={props.styles.stepFooter}>
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

export default observer(LeagueSelectionForm);
