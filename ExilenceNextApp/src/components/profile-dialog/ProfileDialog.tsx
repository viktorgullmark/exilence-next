import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Formik, FormikActions } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import error from '../../helpers/validation.helper';
import { IStashTab } from '../../interfaces/stash.interface';
import { Character } from '../../store/domains/character';
import { League } from '../../store/domains/league';
import LeagueDropdown from '../league-dropdown/LeagueDropdown';
import PriceLeagueDropdown from '../price-league-dropdown/PriceLeagueDropdown';
import StashTabDropdown from '../stash-tab-dropdown/StashTabDropdown';
import { Profile } from './../../store/domains/profile';

interface ProfileDialogProps {
  isOpen: boolean;
  isEditing?: boolean;
  profile: Profile;
  leagueUuid: string;
  priceLeagueUuid: string;
  leagues: League[];
  priceLeagues: League[];
  stashTabs: IStashTab[];
  stashTabIds: string[];
  characters: Character[];
  handleClickClose: Function;
  handleLeagueChange: Function;
  handleSubmit: Function;
  handleStashTabChange: Function;
}

export interface ProfileFormValues {
  profileName: string;
  league?: string;
  priceLeague?: string;
  stashTabIds?: string[];
}

const useStyles = makeStyles((theme: Theme) => ({
  dialogContent: {
    minWidth: 500,
    maxWidth: 500
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: theme.spacing(2, 0)
  }
}));

const ProfileDialog: React.FC<ProfileDialogProps> = (
  props: ProfileDialogProps
) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const noCharacters = t(error.noCharacters(props.characters));
  return (
    <div>
      <Dialog
        open={props.isOpen}
        onClose={() => props.handleClickClose()}
        aria-labelledby="profile-dialog-title"
      >
        <DialogTitle id="profile-dialog-title">
          {props.isEditing
            ? t('title.save_profile')
            : t('title.create_profile')}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Formik
            initialValues={{
              profileName: props.isEditing ? props.profile.name : '',
              league: props.leagueUuid,
              priceLeague: props.priceLeagueUuid
            }}
            onSubmit={(
              values: ProfileFormValues,
              { setSubmitting }: FormikActions<ProfileFormValues>
            ) => {
              props.handleSubmit(values);
            }}
            validationSchema={Yup.object().shape({
              profileName: Yup.string().required('Required'),
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
                handleSubmit,
                handleBlur
              } = formProps;

              return (
                <form onSubmit={handleSubmit}>
                  <TextField
                    label={t('label.profile_name')}
                    name="profileName"
                    value={values.profileName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      errors.profileName &&
                      touched.profileName &&
                      errors.profileName
                    }
                    error={
                      touched.profileName && errors.profileName !== undefined
                    }
                    margin="none"
                    fullWidth
                  />
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
                    priceLeagues={props.priceLeagues}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    values={values}
                  />
                  <StashTabDropdown
                    stashTabs={props.stashTabs}
                    touched={touched}
                    errors={errors}
                    stashTabIds={props.stashTabIds}
                    handleStashTabChange={props.handleStashTabChange}
                    handleChange={handleChange}
                  />
                  <div className={classes.dialogActions}>
                    <Button onClick={() => props.handleClickClose()}>
                      {t('action.cancel')}
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      color="primary"
                      disabled={noCharacters.length > 0}
                    >
                      {props.isEditing
                        ? t('action.save_profile')
                        : t('action.create_profile')}
                    </Button>
                  </div>
                </form>
              );
            }}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileDialog;
