import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../..';
import { IStatusMessage } from '../../interfaces/status-message.interface';
import StatusMessage from './StatusMessage';

type StatusMessageContainerProps = {
  overrideMessage?: IStatusMessage;
};

const StatusMessageContainer = ({ overrideMessage }: StatusMessageContainerProps) => {
  const { uiStateStore } = useStores();
  const { t } = useTranslation();

  return (
    <StatusMessage
      statusMessage={overrideMessage || uiStateStore!.statusMessage}
      isSnapshotting={uiStateStore.isSnapshotting}
      infoLabel={uiStateStore.isSnapshotting ? t('label.snapshotting_info_icon') : undefined}
    />
  );
};

export default observer(StatusMessageContainer);
