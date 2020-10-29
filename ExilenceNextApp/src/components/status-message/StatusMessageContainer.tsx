import React from 'react';
import { inject, observer } from 'mobx-react';

import { UiStateStore } from '../../store/uiStateStore';
import StatusMessage from './StatusMessage';
import { IStatusMessage } from '../../interfaces/status-message.interface';

type StatusMessageContainerProps = {
  uiStateStore?: UiStateStore;
  overrideMessage?: IStatusMessage;
};

const StatusMessageContainer = ({ uiStateStore, overrideMessage }: StatusMessageContainerProps) => {
  return <StatusMessage statusMessage={overrideMessage || uiStateStore!.statusMessage} />;
};

export default inject('uiStateStore')(observer(StatusMessageContainer));
