import React from 'react';
import { inject, observer } from 'mobx-react';

import { IApiAccount } from '../../../interfaces/api/api-account.interface';
import { SignalrStore } from '../../../store/signalrStore';
import PlayerListItem from './PlayerListItem';

type PlayerListItemContainerProps = {
  account: IApiAccount;
  signalrStore?: SignalrStore;
};

const PlayerListItemContainer = ({ signalrStore, account }: PlayerListItemContainerProps) => {
  const { activeAccounts } = signalrStore!.activeGroup!;

  const handleToggle = (uuid: string) => {
    const currentIndex = activeAccounts.indexOf(uuid);

    if (currentIndex === -1) {
      signalrStore!.activeGroup!.selectAccount(uuid);
    } else {
      signalrStore!.activeGroup!.deselectAccount(uuid);
    }
  };

  return (
    <PlayerListItem
      account={account}
      handleToggle={handleToggle}
      selected={activeAccounts.indexOf(account.uuid) !== -1}
    />
  );
};

export default inject('signalrStore')(observer(PlayerListItemContainer));
