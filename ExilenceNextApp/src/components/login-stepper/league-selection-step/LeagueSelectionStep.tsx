import {
  TextField,
  makeStyles,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { Formik } from 'formik';
import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { AccountStore } from '../../../store/accountStore';

interface LeagueSelectionStepProps {
  accountStore?: AccountStore;
  handleBack: Function;
  handleReset: Function;
  activeStep: number;
  styles: Record<string, string>;
}

const LeagueSelectionStep: React.FC<LeagueSelectionStepProps> = (
  props: LeagueSelectionStepProps
) => {
  const { t } = useTranslation();
  const [, setSubmitComplete] = useState(false);

  return (
    <Formik
      initialValues={{ league: '', pricingLeague: '' }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitComplete(true);
        // props.handleNext();
      }}
      // validationSchema={Yup.object().shape({
      //   league: Yup.string().required('Required'),
      //   pricingLeague: Yup.string().required('Required')
      // })}
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
              <FormControl fullWidth>
                <InputLabel htmlFor="age-simple">Age</InputLabel>
                <Select
                  value={values.league}
                  onChange={handleChange}
                  inputProps={{
                    name: 'age',
                    id: 'age-simple'
                  }}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
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
