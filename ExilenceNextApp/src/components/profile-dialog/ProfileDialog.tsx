import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Formik, FormikActions } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import error from '../../helpers/validation.helper';
import { League } from '../../store/domains/league';
import LeagueDropdown from '../league-dropdown/LeagueDropdown';
import PriceLeagueDropdown from '../price-league-dropdown/PriceLeagueDropdown';
import { Character } from '../../store/domains/character';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface ProfileDialogProps {
  handleClickOpen: Function;
  handleClickClose: Function;
  isOpen: boolean;
  profileUuid?: string;
  selectedLeague: League;
  selectedPriceLeagueUuid?: string;
  leagues: League[];
  handleLeagueChange: Function;
  handleSubmit: Function;
}

export interface ProfileFormValues {
  league?: string;
  priceLeague?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  dialogContent: {
    minWidth: 400
  }
}));

const ProfileDialog: React.FC<ProfileDialogProps> = (
  props: ProfileDialogProps
) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const noCharacters = t(error.noCharacters(props.selectedLeague.characters));
  return (
    <div>
      <Dialog
        open={props.isOpen}
        onClose={() => props.handleClickClose()}
        aria-labelledby="profile-dialog-title"
      >
        <DialogTitle id="profile-dialog-title">
          {props.profileUuid
            ? t('title.save_profile')
            : t('title.create_profile')}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Formik
            initialValues={{
              league: props.selectedLeague.uuid,
              priceLeague: props.selectedPriceLeagueUuid
            }}
            onSubmit={(
              values: ProfileFormValues,
              { setSubmitting }: FormikActions<ProfileFormValues>
            ) => {
              props.handleSubmit();
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
                </form>
              );
            }}
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => props.handleClickClose()}>
            {t('action.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={() => props.handleClickClose()}
            color="primary"
          >
            {props.profileUuid
              ? t('action.save_profile')
              : t('action.create_profile')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProfileDialog;
