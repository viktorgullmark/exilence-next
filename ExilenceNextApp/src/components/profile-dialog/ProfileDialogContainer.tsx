import { inject, observer } from 'mobx-react';
import React, { useEffect, useState, ChangeEvent } from 'react';
import Dd from '../../utils/dropdown.utils';
import { IProfile } from '../../interfaces/profile.interface';
import { IStashTab } from '../../interfaces/stash.interface';
import { Character } from '../../store/domains/character';
import { Profile } from '../../store/domains/profile';
import { LeagueStore } from '../../store/leagueStore';
import { AccountStore } from './../../store/accountStore';
import ProfileDialog, { ProfileFormValues } from './ProfileDialog';

interface Props {
  accountStore?: AccountStore;
  leagueStore?: LeagueStore;
  isOpen: boolean;
  isEditing: boolean;
  profile: Profile;
  handleClickOpen: () => void;
  handleClickClose: () => void;
}

const ProfileDialogContainer: React.FC<Props> = ({
  accountStore,
  leagueStore,
  profile,
  isOpen,
  isEditing,
  handleClickClose
}: Props) => {
  const account = accountStore!.getSelectedAccount;
  const {
    activeLeague,
    activePriceLeague,
    accountLeagues,
    activeProfile
  } = account;
  const { leagues, priceLeagues } = leagueStore!;

  const [characters, setCharacters] = useState<Character[]>([]);
  const [league, setLeague] = useState('');
  const [priceLeague, setPriceLeague] = useState('');
  const [stashTabs, setStashTabs] = useState<IStashTab[]>([]);

  useEffect(() => {
    if (isOpen) {
      const foundLeague = getLeagueSelection(isEditing);
      const accountLeague = accountLeagues.find(
        l => l.leagueId === foundLeague.id
      );
      setStashTabIds([]);
      setLeague(foundLeague.id);

      if (foundLeague && accountLeague) {
        setPriceLeague(getPriceLeagueSelection(isEditing).id);
        setCharacters(accountLeague.characters);
        setStashTabs(accountLeague.stashtabs);
      }

      if (isEditing) {
        setStashTabIds(profile.activeStashTabIds);
      }
    }
  }, [isOpen]);

  const [stashTabIds, setStashTabIds] = React.useState<string[]>([]);

  const handleStashTabChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setStashTabIds(event.target.value as string[]);
  };

  const getLeagueSelection = (edit: boolean) => {
    const id = Dd.getDropdownSelection(leagues, edit && activeLeague ? activeLeague.id : '');

    // fallback in case league doesnt exist anymore
    const foundLeague = leagues.find(l => l.id === id);
    return foundLeague ? foundLeague : leagues[0];
  };

  const getPriceLeagueSelection = (edit: boolean) => {
    const id = Dd.getDropdownSelection(
      priceLeagues,
      edit ? activePriceLeague.id : ''
    );

    // fallback in case league doesnt exist anymore
    const foundLeague = priceLeagues.find(l => l.id === id);
    return foundLeague ? foundLeague : priceLeagues[0];
  };

  const handleLeagueChange = (event: ChangeEvent<{ value: unknown; }>) => {
    const id = event.target.value;
    let accountLeague = accountStore!.getSelectedAccount.accountLeagues.find(
      l => l.leagueId === id
    );

    let characters: Character[] = [];

    setStashTabIds([]);
  
    if (accountLeague) {
      characters = accountLeague.characters;
      setStashTabs(accountLeague.stashtabs);
      setCharacters(characters);
    } else {
      setStashTabs([]);
      setCharacters([]);
    }
    setLeague(id as string);
  };

  const handleSubmit = (values: ProfileFormValues) => {
    const profile: IProfile = {
      name: values.profileName,
      activeLeagueId: values.league,
      activePriceLeagueId: values.priceLeague,
      activeStashTabIds: stashTabIds
    };
    if (isEditing) {
      accountStore!.getSelectedAccount.activeProfile.editProfile(profile);
    } else {
      accountStore!.getSelectedAccount.createProfile(profile);
    }
    handleClickClose();
  };
  return (
    <ProfileDialog
      profile={profile}
      isOpen={isOpen}
      isEditing={isEditing}
      handleClickClose={handleClickClose}
      handleLeagueChange={handleLeagueChange}
      handleSubmit={(form: ProfileFormValues) => handleSubmit(form)}
      leagueUuid={league}
      priceLeagueUuid={priceLeague}
      handleStashTabChange={handleStashTabChange}
      stashTabIds={stashTabIds}
      leagues={leagues}
      priceLeagues={leagueStore!.priceLeagues}
      stashTabs={stashTabs}
      characters={characters}
    />
  );
};

export default inject(
  'accountStore',
  'leagueStore'
)(observer(ProfileDialogContainer));
