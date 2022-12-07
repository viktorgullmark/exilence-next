import React from 'react';
import {
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import useStyles from './ProfileGridItem.styles';
import { useTranslation } from 'react-i18next';
import { Profile } from '../../../../store/domains/profile';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import { getDropdownSelection, mapDomainToDropdown } from '../../../../utils/dropdown.utils';

type ProfileGridItemProps = {
  profiles: Profile[];
  signalrOnline: boolean;
  isSnapshotting: boolean;
  activeProfile?: Profile;
  isInitiating: boolean;
  profilesLoaded: boolean;
  handleRemoveProfile: () => void;
  handleProfileOpen: (edit?: boolean) => void;
  handleProfileChange: (event: SelectChangeEvent<string>) => void;
};

const ProfileGridItem = ({
  profiles,
  signalrOnline,
  isSnapshotting,
  activeProfile,
  isInitiating,
  profilesLoaded,
  handleRemoveProfile,
  handleProfileOpen,
  handleProfileChange,
}: ProfileGridItemProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <>
      <Grid item className={classes.profileArea} data-tour-elem="profileArea">
        <Tooltip title={t('label.edit_profile_icon_title') || ''} placement="bottom">
          <span>
            <IconButton
              disabled={
                isSnapshotting ||
                !activeProfile ||
                isInitiating ||
                !profilesLoaded ||
                !signalrOnline
              }
              aria-label="edit"
              className={classes.iconButton}
              onClick={() => handleProfileOpen(true)}
              size="large"
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <FormControl className={classes.formControl}>
          <Select
            disabled={isSnapshotting || isInitiating || !profilesLoaded || !signalrOnline}
            className={classes.selectMenu}
            value={getDropdownSelection(
              mapDomainToDropdown(profiles),
              activeProfile ? activeProfile.uuid : ''
            )}
            onChange={(e) => handleProfileChange(e)}
            inputProps={{
              name: 'profile',
              id: 'profile-dd',
            }}
            variant="standard"
          >
            {profiles.map((profile: Profile) => {
              return (
                <MenuItem key={profile.uuid} value={profile.uuid}>
                  {profile.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <Tooltip title={t('label.create_profile_icon_title') || ''} placement="bottom">
          <span>
            <IconButton
              disabled={isSnapshotting || !profilesLoaded || isInitiating || !signalrOnline}
              onClick={() => handleProfileOpen()}
              aria-label="create"
              className={classes.iconButton}
              size="large"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={t('label.remove_profile_icon_title') || ''} placement="bottom">
          <span>
            <IconButton
              disabled={
                isSnapshotting ||
                profiles.length < 2 ||
                isInitiating ||
                !profilesLoaded ||
                !signalrOnline
              }
              onClick={() => handleRemoveProfile()}
              aria-label="remove profile"
              className={classes.iconButton}
              size="large"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Grid>
    </>
  );
};

export default ProfileGridItem;
