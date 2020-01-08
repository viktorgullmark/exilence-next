import { inject, observer } from 'mobx-react';
import React from 'react';
import { IApiAccount } from '../../../interfaces/api/api-account.interface';
import { SignalrStore } from '../../../store/signalrStore';
import PlayerListItem from './PlayerListItem';

interface Props {
  account: IApiAccount;
  signalrStore?: SignalrStore;
}

const PlayerListItemContainer: React.FC<Props> = ({
  signalrStore,
  account
}: Props) => {
  const { activeAccounts } = signalrStore!;

  const handleToggle = (uuid: string) => {
    const currentIndex = activeAccounts.indexOf(uuid);

    if (currentIndex === -1) {
      signalrStore!.selectAccount(uuid);
    } else {
      signalrStore!.deselectAccount(uuid);
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
