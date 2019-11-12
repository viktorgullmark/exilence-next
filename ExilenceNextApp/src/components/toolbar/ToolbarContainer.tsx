import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { DropdownHelper } from '../../helpers/dropdown.helper';
import { AccountStore } from '../../store/accountStore';
import { Character } from '../../store/domains/character';
import { IProfile } from './../../interfaces/profile.interface';
import { externalService } from './../../services/external.service';
import { LeagueStore } from './../../store/leagueStore';
import { UiStateStore } from './../../store/uiStateStore';
import { ProfileFormValues } from './../profile-dialog/ProfileDialog';
import Toolbar from './Toolbar';

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
  const { leagues, priceLeagues } = leagueStore!;

  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleOpen = (edit: boolean = false) => {
    const foundLeague = getLeagueSelection(edit);
    setIsEditing(edit);
    setLeague(foundLeague.uuid);
    setPriceLeague(getPriceLeagueSelection(edit).uuid);
    setCharacters(
      accountLeagues.find(l => l.uuid === foundLeague.uuid)!.characters
    );
    setProfileOpen(true);
  };

  const handleClose = () => {
    setProfileOpen(false);
  };

  const getLeagueSelection = (edit: boolean) => {
    const uuid = DropdownHelper.getDropdownSelection(
      leagues,
      edit ? activeLeague.uuid : ''
    );

    const accountLeague = accountLeagues.find(l => l.uuid === uuid);
    if (accountLeague) {
      accountLeague.getStashTabs();
    }

    const foundLeague = leagues.find(l => l.uuid === uuid);
    return foundLeague!;
  };

  const getPriceLeagueSelection = (edit: boolean) => {
    const uuid = DropdownHelper.getDropdownSelection(
      priceLeagues,
      edit ? activePriceLeague.uuid : ''
    );
    return priceLeagues.find(l => l.uuid === uuid)!;
  };

  const [characters, setCharacters] = useState<Character[]>([]);
  const [league, setLeague] = useState('');
  const [priceLeague, setPriceLeague] = useState('');

  const handleLeagueChange = (event: React.ChangeEvent<{ value: string }>) => {
    const uuid = event.target.value;
    const accountLeague = accountStore!.getSelectedAccount.accountLeagues.find(
      l => l.uuid === uuid
    );

    let characters: Character[] = [];

    if (accountLeague) {
      accountLeague.getStashTabs();
      characters = accountLeague.characters;
    }

    setLeague(uuid);
    setCharacters(characters);
  };

  const handleSnapshot = () => {
    console.log('handle snapshot');
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
      handleSnapshot={handleSnapshot}
      leagues={leagues}
      priceLeagues={leagueStore!.priceLeagues}
      stashTabs={accountStore!.getSelectedAccount.accountLeagues[0].stashtabs}
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
