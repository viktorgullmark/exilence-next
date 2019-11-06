import React, { useState } from 'react';
import ProfileDialog from './ProfileDialog';
import { observer, inject } from 'mobx-react';
import { UiStateStore } from './../../store/uiStateStore';
import { AccountStore } from '../../store/accountStore';
import { DropdownHelper } from '../../helpers/dropdown.helper';

interface ProfileDialogContainerProps {
  uiStateStore?: UiStateStore;
  accountStore?: AccountStore;
  handleClickOpen: Function;
  handleClickClose: Function;
  isOpen: boolean;
}

const ProfileDialogContainer: React.FC<ProfileDialogContainerProps> = (props: ProfileDialogContainerProps) => {
  const account = props.accountStore!.getSelectedAccount;

  const { leagues, activeLeague, activePriceLeague } = account;

  const handleLeagueChange = (event: React.ChangeEvent<{ value: string }>) => {
    props.accountStore!.getSelectedAccount.activeProfile.setActiveLeague(
      event.target.value
    );
  };

  const handleSubmit = (event: React.ChangeEvent<{ value: string }>) => {
    console.log('submitted!');
  };

  const selectedLeague = () => {
    const uuid = DropdownHelper.getDropdownSelection(
        leagues,
        activeLeague.uuid
      );

    return leagues.find(l => l.uuid === uuid)!;
  }

  return (
    <ProfileDialog
      isOpen={props.isOpen}
      handleSubmit={handleSubmit}
      handleClickClose={props.handleClickClose}
      handleClickOpen={props.handleClickOpen}
      handleLeagueChange={handleLeagueChange}
      leagues={leagues}
      selectedLeague={selectedLeague()}
      selectedPriceLeagueUuid={DropdownHelper.getDropdownSelection(
        leagues,
        activePriceLeague.uuid
      )}
    />
  );
};

export default inject('uiStateStore', 'accountStore')(
  observer(ProfileDialogContainer)
);
