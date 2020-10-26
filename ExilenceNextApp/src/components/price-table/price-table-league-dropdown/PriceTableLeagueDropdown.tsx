import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { League } from '../../../store/domains/league';
import PriceLeagueDropdown from '../../price-league-dropdown/PriceLeagueDropdown';
import useStyles from './PriceTableLeagueDropdown.styles';
import { PriceTableFilterForm } from './PriceTableLeagueDropdownContainer';

type PriceTableLeagueDropdownProps = {
  initialValues: PriceTableFilterForm;
  validationSchema: Yup.ObjectSchema<any, object>;
  priceLeagues: League[];
  onSubmit: (form: PriceTableFilterForm) => void;
};

const PriceTableLeagueDropdown = ({
  initialValues,
  validationSchema,
  onSubmit,
  priceLeagues,
}: PriceTableLeagueDropdownProps) => {
  const classes = useStyles();
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => onSubmit(values)}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({ values, touched, handleChange, errors }) => (
        <form className={classes.form}>
          <PriceLeagueDropdown
            priceLeagues={priceLeagues}
            touched={touched}
            errors={errors}
            required={false}
            handleChange={(e) => {
              handleChange(e);
              onSubmit({ priceLeague: e.target.value as string });
            }}
            values={values}
            size={'small'}
            margin={'dense'}
          />
        </form>
      )}
    </Formik>
  );
};

export default PriceTableLeagueDropdown;
