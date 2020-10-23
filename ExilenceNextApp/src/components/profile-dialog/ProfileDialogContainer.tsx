import React, { ChangeEvent, useEffect, useState } from 'react';
import { inject, observer } from 'mobx-react';
import uuid from 'uuid';

import { IProfile } from '../../interfaces/profile.interface';
import { IStashTab } from '../../interfaces/stash.interface';
import { Character } from '../../store/domains/character';
import { Profile } from '../../store/domains/profile';
import { LeagueStore } from '../../store/leagueStore';
import { UiStateStore } from '../../store/uiStateStore';
import { getDropdownSelection } from '../../utils/dropdown.utils';
import { placeholderOption } from '../../utils/misc.utils';
import { AccountStore } from './../../store/accountStore';
import ProfileDialog, { ProfileFormValues } from './ProfileDialog';

type ProfileDialogContainerProps = {
  accountStore?: AccountStore;
  leagueStore?: LeagueStore;
  uiStateStore?: UiStateStore;
  isOpen: boolean;
  isEditing: boolean;
  profile?: Profile;
  handleClickOpen: () => void;
  handleClickClose: () => void;
};

const ProfileDialogContainer = ({
  accountStore,
  leagueStore,
  uiStateStore,
  profile,
  isOpen,
  isEditing,
  handleClickClose,
}: ProfileDialogContainerProps) => {
  const account = accountStore!.getSelectedAccount;
  const {
    activeLeague,
    activePriceLeague,
    activeCharacter,
    accountLeagues,
    activeProfile,
    characters,
  } = account;
  const { leagues, priceLeagues } = leagueStore!;

  const [chars, setCharacters] = useState<Character[]>(characters ? characters : []);
  const [league, setLeague] = useState('');
  const [priceLeague, setPriceLeague] = useState('');
  const [stashTabs, setStashTabs] = useState<IStashTab[]>([]);

  useEffect(() => {
    if (isOpen) {
      const foundLeague = getLeagueSelection(isEditing);
      const accountLeague = accountLeagues.find((l) => l.leagueId === foundLeague.id);
      setSelectedStashTabs([]);
      setLeague(foundLeague.id);

      if (foundLeague && accountLeague) {
        setPriceLeague(getPriceLeagueSelection(isEditing).id);
        setCharacters(accountLeague.characters);
        setStashTabs(accountLeague.stashtabs);

        if (isEditing) {
          setSelectedStashTabs(
            accountLeague.stashtabs.filter((s) => profile!.activeStashTabIds.includes(s.id))
          );
        }
      }
    }
  }, [isOpen]);

  const [selectedStashTabs, setSelectedStashTabs] = React.useState<IStashTab[]>([]);

  const handleStashTabChange = (_event: ChangeEvent<{}>, value: IStashTab[]) => {
    setSelectedStashTabs(value);
  };

  const getLeagueSelection = (edit: boolean) => {
    const id = getDropdownSelection(leagues, edit && activeLeague ? activeLeague.id : '');

    // fallback in case league doesnt exist anymore
    const foundLeague = leagues.find((l) => l.id === id);
    return foundLeague ? foundLeague : leagues[0];
  };

  const getPriceLeagueSelection = (edit: boolean) => {
    const id = getDropdownSelection(
      priceLeagues,
      edit && activePriceLeague ? activePriceLeague.id : ''
    );

    // fallback in case league doesnt exist anymore
    const foundLeague = priceLeagues.find((l) => l.id === id);
    return foundLeague ? foundLeague : priceLeagues[0];
  };

  const handleLeagueChange = (event: ChangeEvent<{ value: unknown }>) => {
    const id = event.target.value;
    const accountLeague = accountStore!.getSelectedAccount.accountLeagues.find(
      (l) => l.leagueId === id
    );
    setSelectedStashTabs([]);

    if (accountLeague) {
      setStashTabs(accountLeague.stashtabs);
      setCharacters(accountLeague.characters);
    } else {
      setStashTabs([]);
      setCharacters([]);
    }
    setLeague(id as string);
  };

  const handleSubmit = (values: ProfileFormValues) => {
    const profile: IProfile = {
      uuid: isEditing ? activeProfile!.uuid : uuid.v4(),
      name: values.profileName,
      activeLeagueId: values.league,
      activePriceLeagueId: values.priceLeague,
      activeStashTabIds: selectedStashTabs.map((s) => s.id),
      active: true,
      activeCharacterName: values.character,
      includeEquipment: values.includeEquipment,
      includeInventory: values.includeInventory,
    };
    if (isEditing) {
      accountStore!.getSelectedAccount.activeProfile!.updateProfile(profile, handleClickClose);
    } else {
      accountStore!.getSelectedAccount.createProfile(profile, handleClickClose);
    }
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
      selectedStashTabs={selectedStashTabs}
      leagues={leagues}
      priceLeagues={leagueStore!.priceLeagues}
      stashTabs={stashTabs}
      characterName={isEditing && activeCharacter ? activeCharacter.name : placeholderOption}
      includeEquipment={isEditing && activeProfile ? activeProfile!.includeEquipment : false}
      includeInventory={isEditing && activeProfile ? activeProfile!.includeInventory : false}
      characters={chars}
      loading={uiStateStore!.savingProfile}
    />
  );
};

export default inject(
  'uiStateStore',
  'accountStore',
  'leagueStore'
)(observer(ProfileDialogContainer));
