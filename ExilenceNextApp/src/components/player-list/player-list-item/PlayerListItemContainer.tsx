import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../../..';
import { IApiAccount } from '../../../interfaces/api/api-account.interface';
import PlayerListItem from './PlayerListItem';

type PlayerListItemContainerProps = {
  account: IApiAccount;
};

const PlayerListItemContainer = ({ account }: PlayerListItemContainerProps) => {
  const { signalrStore } = useStores();
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

export default observer(PlayerListItemContainer);
