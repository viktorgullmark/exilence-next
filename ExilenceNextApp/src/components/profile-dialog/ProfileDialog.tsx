import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, SelectChangeEvent } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CasinoIcon from '@mui/icons-material/CasinoRounded';
import { Formik } from 'formik';
import * as Yup from 'yup';
import SaveIcon from '@mui/icons-material/Save';

import { ISelectOption } from '../../interfaces/select-option.interface';
import { IStashTab } from '../../interfaces/stash.interface';
import { Character } from '../../store/domains/character';
import { League } from '../../store/domains/league';
import { placeholderOption } from '../../utils/misc.utils';
import { generateProfileName } from '../../utils/profile.utils';
import { noCharError } from '../../utils/validation.utils';
import CheckboxField from '../checkbox-field/CheckboxField';
import LeagueDropdown from '../league-dropdown/LeagueDropdown';
import PriceLeagueDropdown from '../price-league-dropdown/PriceLeagueDropdown';
import LoadingButton from '@mui/lab/LoadingButton';
import SelectField from '../select-field/SelectField';
import SimpleField from '../simple-field/SimpleField';
import StashTabDropdown from '../stash-tab-dropdown/StashTabDropdown';
import { Profile } from './../../store/domains/profile';
import useStyles from './ProfileDialog.styles';

export interface ProfileFormValues {
  profileName: string;
  league?: string;
  priceLeague?: string;
  stashTabIds?: string[];
  includeEquipment?: boolean;
  includeInventory?: boolean;
  character: string;
}

type ProfileDialogProps = {
  isOpen: boolean;
  loading: boolean;
  isEditing?: boolean;
  profile?: Profile;
  characterName: string;
  leagueUuid: string;
  priceLeagueUuid: string;
  leagues: League[];
  priceLeagues: League[];
  stashTabs: IStashTab[];
  selectedStashTabs: IStashTab[];
  characters: Character[];
  includeInventory?: boolean;
  includeEquipment?: boolean;
  handleClickClose: () => void;
  handleLeagueChange: (event: SelectChangeEvent<string>) => void;
  handleSubmit: (values: ProfileFormValues) => void;
  handleStashTabChange: (event: ChangeEvent<{}>, value: IStashTab[]) => void;
};

const ProfileDialog = ({
  isOpen,
  loading,
  isEditing,
  profile,
  leagueUuid,
  includeInventory,
  includeEquipment,
  priceLeagueUuid,
  leagues,
  priceLeagues,
  stashTabs,
  selectedStashTabs,
  characters,
  handleClickClose,
  handleLeagueChange,
  handleSubmit,
  characterName,
  handleStashTabChange,
}: ProfileDialogProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const noCharacters = t(noCharError(characters));
  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') {
            handleClickClose();
          }
        }}
        aria-labelledby="profile-dialog-title"
      >
        <DialogTitle id="profile-dialog-title">
          {isEditing ? t('title.save_profile') : t('title.create_profile')}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Formik
            initialValues={{
              profileName: isEditing && profile ? profile.name : generateProfileName(),
              league: leagueUuid,
              priceLeague: priceLeagueUuid,
              selectedStashTabs: selectedStashTabs,
              character: characterName,
              includeEquipment: includeEquipment,
              includeInventory: includeInventory,
            }}
            onSubmit={(values: ProfileFormValues) => {
              handleSubmit(values);
            }}
            validationSchema={Yup.object().shape({
              profileName: Yup.string().required('Required'),
              league: Yup.string().required('Required'),
              priceLeague: Yup.string().required('Required'),
            })}
          >
            {/* todo: refactor and use new formik */}
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              dirty,
              isValid,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <SimpleField
                  name="profileName"
                  type="text"
                  label={t('label.profile_name')}
                  placeholder={t('label.profile_name_placeholder')}
                  endIcon={
                    <IconButton
                      aria-label="generate"
                      title={t('label.generate_name_icon_title')}
                      edge="start"
                      size="small"
                      onClick={() => {
                        const name = generateProfileName();
                        setFieldValue('profileName', name);
                      }}
                    >
                      <CasinoIcon />
                    </IconButton>
                  }
                  required
                  autoFocus
                />
                <PriceLeagueDropdown
                  priceLeagues={priceLeagues}
                  touched={touched}
                  errors={errors}
                  handleChange={handleChange}
                  values={values}
                />
                <LeagueDropdown
                  leagues={leagues}
                  touched={touched}
                  errors={errors}
                  fullWidth
                  noCharacters={noCharacters}
                  handleLeagueChange={(e) => {
                    handleLeagueChange(e);
                    // reset these fields when league changes
                    setFieldValue('character', placeholderOption);
                    setFieldValue('includeEquipment', false);
                    setFieldValue('includeInventory', false);
                  }}
                  handleChange={handleChange}
                  values={values}
                />
                <StashTabDropdown
                  stashTabs={stashTabs}
                  selectedStashTabs={selectedStashTabs}
                  handleStashTabChange={handleStashTabChange}
                  handleChange={handleChange}
                  marginBottom={3}
                  marginTop={2}
                  displayCountWarning
                />
                <Box mt={2}>
                  <SelectField
                    name="character"
                    label={t('label.select_character')}
                    options={characters?.map((c) => {
                      return {
                        id: c.name,
                        value: c.name,
                        label: c.name,
                      } as ISelectOption;
                    })}
                    hasPlaceholder
                  />
                  <CheckboxField
                    name="includeEquipment"
                    label={t('label.include_equipment')}
                    disabled={!values.character || values.character === placeholderOption}
                  />
                  <CheckboxField
                    name="includeInventory"
                    label={t('label.include_inventory')}
                    disabled={!values.character || values.character === placeholderOption}
                  />
                </Box>
                <div className={classes.dialogActions}>
                  <Button onClick={() => handleClickClose()}>{t('action.cancel')}</Button>
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    color="primary"
                    loadingPosition="end"
                    loading={loading}
                    endIcon={<SaveIcon />}
                    disabled={noCharacters.length > 0 || (dirty && !isValid)}
                  >
                    {isEditing ? t('action.save_profile') : t('action.create_profile')}
                  </LoadingButton>
                </div>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileDialog;
