import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../..';
import { IStatusMessage } from '../../interfaces/status-message.interface';
import StatusMessage from './StatusMessage';

type StatusMessageContainerProps = {
  overrideMessage?: IStatusMessage;
};

const StatusMessageContainer = ({ overrideMessage }: StatusMessageContainerProps) => {
  const { uiStateStore } = useStores();
  return <StatusMessage statusMessage={overrideMessage || uiStateStore!.statusMessage} />;
};

export default observer(StatusMessageContainer);
