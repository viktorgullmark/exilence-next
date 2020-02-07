import { inject, observer } from 'mobx-react';
import React from 'react';
import { UiStateStore } from '../../store/uiStateStore';
import StatusMessage from './StatusMessage';

interface Props {
  uiStateStore?: UiStateStore;
}

const StatusMessageContainer: React.FC<Props> = ({ uiStateStore }: Props) => {
  return <StatusMessage statusMessage={uiStateStore!.statusMessage}/>
};

export default inject('uiStateStore')(observer(StatusMessageContainer));
