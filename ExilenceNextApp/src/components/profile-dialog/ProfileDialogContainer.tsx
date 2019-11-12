import { inject, observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { DropdownHelper } from "../../helpers/dropdown.helper";
import { IProfile } from "../../interfaces/profile.interface";
import { IStashTab } from "../../interfaces/stash.interface";
import { Character } from "../../store/domains/character";
import { Profile } from "../../store/domains/profile";
import { LeagueStore } from "../../store/leagueStore";
import { AccountStore } from "./../../store/accountStore";
import ProfileDialog, { ProfileFormValues } from "./ProfileDialog";

interface Props {
  accountStore?: AccountStore;
  leagueStore?: LeagueStore;
  isOpen: boolean;
  isEditing: boolean;
  profile: Profile;
  handleClickOpen: Function;
  handleClickClose: Function;
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
  const [league, setLeague] = useState("");
  const [priceLeague, setPriceLeague] = useState("");
  const [stashTabs, setStashTabs] = useState<IStashTab[]>([]);

  useEffect(() => {
    if (isOpen) {
      const foundLeague = getLeagueSelection(isEditing);
      const accountLeague = accountLeagues.find(
        l => l.uuid === foundLeague.uuid
      );
      setStashTabIds([]);
      setLeague(foundLeague.uuid);

      if (foundLeague && accountLeague) {
        setPriceLeague(getPriceLeagueSelection(isEditing).uuid);
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
    const uuid = DropdownHelper.getDropdownSelection(
      leagues,
      edit ? activeLeague.uuid : ""
    );

    const foundLeague = leagues.find(l => l.uuid === uuid);
    return foundLeague!;
  };

  const getPriceLeagueSelection = (edit: boolean) => {
    const uuid = DropdownHelper.getDropdownSelection(
      priceLeagues,
      edit ? activePriceLeague.uuid : ""
    );
    return priceLeagues.find(l => l.uuid === uuid)!;
  };

  const handleLeagueChange = (event: React.ChangeEvent<{ value: string }>) => {
    const uuid = event.target.value;
    const accountLeague = accountStore!.getSelectedAccount.accountLeagues.find(
      l => l.uuid === uuid
    );

    let characters: Character[] = [];

    setStashTabIds([]);

    if (accountLeague) {
      characters = accountLeague.characters;
      setStashTabs(accountLeague.stashtabs);
    }

    setLeague(uuid);
    setCharacters(characters);
  };

  const handleSubmit = (values: ProfileFormValues) => {
    const profile: IProfile = {
      name: values.profileName,
      activeLeagueUuid: values.league,
      activePriceLeagueUuid: values.priceLeague,
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
    ></ProfileDialog>
  );
};

export default inject(
  "accountStore",
  "leagueStore"
)(observer(ProfileDialogContainer));
