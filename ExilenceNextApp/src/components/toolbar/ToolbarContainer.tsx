import React, { useState } from 'react';
import Toolbar from './Toolbar';
import { observer, inject } from 'mobx-react';
import { UiStateStore } from './../../store/uiStateStore';
import { AccountStore } from '../../store/accountStore';
import { DropdownHelper } from '../../helpers/dropdown.helper';
import { Character } from '../../store/domains/character';
import { IProfile } from './../../interfaces/profile.interface';
import { ProfileFormValues } from './../profile-dialog/ProfileDialog';
import { LeagueStore } from './../../store/leagueStore';

interface ToolbarContainerProps {
  uiStateStore?: UiStateStore;
  accountStore?: AccountStore;
  leagueStore?: LeagueStore;
}

const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  uiStateStore,
  accountStore,
  leagueStore
}: ToolbarContainerProps) => {
  const account = accountStore!.getSelectedAccount;
  const { activeLeague, activePriceLeague, accountLeagues } = account;
  const { leagues } = leagueStore!;

  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpen = (edit: boolean = false) => {
    setIsEditing(edit);
    setLeague(getLeagueSelection(edit).uuid);
    setPriceLeague(getPriceLeagueSelection(edit).uuid);
    setCharacters(getLeagueSelection(edit).characters);
    setProfileOpen(true);
  };

  const handleClose = () => {
    setProfileOpen(false);
  };

  const getLeagueSelection = (edit: boolean) => {
    const uuid = DropdownHelper.getDropdownSelection(
      accountLeagues,
      edit ? activeLeague.uuid : ''
    );
    return accountLeagues.find(l => l.uuid === uuid)!;
  };

  const getPriceLeagueSelection = (edit: boolean) => {
    const uuid = DropdownHelper.getDropdownSelection(
      leagues,
      edit ? activePriceLeague.uuid : ''
    );
    return leagues.find(l => l.uuid === uuid)!;
  };

  const [characters, setCharacters] = useState<Character[]>([]);
  const [league, setLeague] = useState('');
  const [priceLeague, setPriceLeague] = useState('');

  const handleLeagueChange = (event: React.ChangeEvent<{ value: string }>) => {
    const uuid = event.target.value;
    setLeague(uuid);
    setCharacters(
      accountStore!.getSelectedAccount.accountLeagues.find(l => l.uuid === uuid)!
        .characters
    );
  };

  const handleSubmit = (values: ProfileFormValues) => {
    const profile: IProfile = {
      name: values.profileName,
      activeLeagueUuid: values.league,
      activePriceLeagueUuid: values.priceLeague
    };
    if (isEditing) {
      accountStore!.getSelectedAccount.activeProfile.editProfile(profile);
    } else {
      accountStore!.getSelectedAccount.createProfile(profile);
    }
    handleClose();
  };

  const handleProfileChange = (event: React.ChangeEvent<{ value: string }>) => {
    console.log('profile change!');
    console.log(event.target.value);
    accountStore!.getSelectedAccount.setActiveProfile(event.target.value);
  };

  return (
    <Toolbar
      sidenavOpened={uiStateStore!.sidenavOpen}
      profiles={accountStore!.getSelectedAccount.profiles}
      activeProfile={accountStore!.getSelectedAccount.activeProfile}
      toggleSidenav={() => uiStateStore!.toggleSidenav()}
      handleProfileChange={handleProfileChange}
      handleLeagueChange={handleLeagueChange}
      leagues={leagues}
      characters={characters}
      isEditing={isEditing}
      profileOpen={profileOpen}
      handleSubmit={(form: ProfileFormValues) => handleSubmit(form)}
      leagueUuid={league}
      priceLeagueUuid={priceLeague}
      handleProfileOpen={(edit: boolean) => handleOpen(edit)}
      handleProfileClose={() => handleClose()}
    />
  );
};

export default inject('uiStateStore', 'accountStore', 'leagueStore')(
  observer(ToolbarContainer)
);
