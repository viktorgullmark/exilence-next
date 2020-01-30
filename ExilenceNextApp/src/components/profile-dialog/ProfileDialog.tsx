import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Formik } from 'formik';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { noCharError } from '../../utils/validation.utils';
import { IStashTab } from '../../interfaces/stash.interface';
import { Character } from '../../store/domains/character';
import { League } from '../../store/domains/league';
import LeagueDropdown from '../league-dropdown/LeagueDropdown';
import PriceLeagueDropdown from '../price-league-dropdown/PriceLeagueDropdown';
import StashTabDropdown from '../stash-tab-dropdown/StashTabDropdown';
import { Profile } from './../../store/domains/profile';
import RequestButton from '../request-button/RequestButton';

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

interface ProfileDialogProps {
  isOpen: boolean;
  loading: boolean;
  isEditing?: boolean;
  profile?: Profile;
  leagueUuid: string;
  priceLeagueUuid: string;
  leagues: League[];
  priceLeagues: League[];
  stashTabs: IStashTab[];
  stashTabIds: string[];
  characters: Character[];
  handleClickClose: () => void;
  handleLeagueChange: (event: ChangeEvent<{ value: unknown }>) => void;
  handleSubmit: (values: ProfileFormValues) => void;
  handleStashTabChange: (event: ChangeEvent<{ value: unknown }>) => void;
}

const ProfileDialog: React.FC<ProfileDialogProps> = ({
  isOpen,
  loading,
  isEditing,
  profile,
  leagueUuid,
  priceLeagueUuid,
  leagues,
  priceLeagues,
  stashTabs,
  stashTabIds,
  characters,
  handleClickClose,
  handleLeagueChange,
  handleSubmit,
  handleStashTabChange
}: ProfileDialogProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const noCharacters = t(noCharError(characters));
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={() => handleClickClose()}
        aria-labelledby="profile-dialog-title"
      >
        <DialogTitle id="profile-dialog-title">
          {isEditing
            ? t('title.save_profile')
            : t('title.create_profile')}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Formik
            initialValues={{
              profileName:
                isEditing && profile ? profile.name : '',
              league: leagueUuid,
              priceLeague: priceLeagueUuid,
              stashTabIds: stashTabIds
            }}
            onSubmit={(values: ProfileFormValues) => {
              handleSubmit(values);
            }}
            validationSchema={Yup.object().shape({
              profileName: Yup.string().required('Required'),
              league: Yup.string().required('Required'),
              priceLeague: Yup.string().required('Required')
            })}
          >
            {/* todo: refactor and use new formik */}
            {(formProps: any) => {
              const {
                values,
                touched,
                errors,
                isSubmitting,
                handleChange,
                handleSubmit,
                handleBlur,
                dirty,
                isValid
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
                    required
                    fullWidth
                  />
                  <LeagueDropdown
                    leagues={leagues}
                    touched={touched}
                    errors={errors}
                    fullWidth
                    noCharacters={noCharacters}
                    handleLeagueChange={handleLeagueChange}
                    handleChange={handleChange}
                    values={values}
                  />
                  <PriceLeagueDropdown
                    priceLeagues={priceLeagues}
                    touched={touched}
                    errors={errors}
                    handleChange={handleChange}
                    values={values}
                  />
                  <StashTabDropdown
                    stashTabs={stashTabs}
                    touched={touched}
                    errors={errors}
                    stashTabIds={stashTabIds}
                    handleStashTabChange={handleStashTabChange}
                    handleChange={handleChange}
                  />
                  <div className={classes.dialogActions}>
                    <Button onClick={() => handleClickClose()}>
                      {t('action.cancel')}
                    </Button>
                    <RequestButton
                      variant="contained"
                      type="submit"
                      color="primary"
                      loading={loading}
                      disabled={
                        loading ||
                        noCharacters.length > 0 ||
                        stashTabIds.length === 0 ||
                        (dirty && !isValid)
                      }
                    >
                      {isEditing
                        ? t('action.save_profile')
                        : t('action.create_profile')}
                    </RequestButton>
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
