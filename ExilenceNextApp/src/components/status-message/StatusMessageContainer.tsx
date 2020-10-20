import { inject, observer } from 'mobx-react';
import React from 'react';
import { UiStateStore } from '../../store/uiStateStore';
import StatusMessage from './StatusMessage';

type StatusMessageContainerProps = {
  uiStateStore?: UiStateStore;
}

const StatusMessageContainer = ({ uiStateStore }: StatusMessageContainerProps) => {
  return <StatusMessage statusMessage={uiStateStore!.statusMessage}/>
};

export default inject('uiStateStore')(observer(StatusMessageContainer));
