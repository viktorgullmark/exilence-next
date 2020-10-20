import React from 'react';
import { inject, observer } from 'mobx-react';

import { SignalrStore } from '../../store/signalrStore';
import { UiStateStore } from '../../store/uiStateStore';
import { generateGroupName } from '../../utils/group.utils';
import GroupDialog from './GroupDialog';

type CreateGroupDialogContainerProps = {
  uiStateStore?: UiStateStore;
  signalrStore?: SignalrStore;
};

export interface IGroupForm {
  name: string;
  password: string;
}

const CreateGroupDialogContainer = ({
  uiStateStore,
  signalrStore,
}: CreateGroupDialogContainerProps) => {
  const initialValues: IGroupForm = {
    name: uiStateStore!.groupDialogType === 'create' ? generateGroupName() : '',
    password: '',
  };

  const onSubmit = (group: IGroupForm) => {
    signalrStore!.joinGroup(group.name, group.password);
  };

  return (
    <GroupDialog
      show={uiStateStore!.groupDialogOpen}
      groupExists={uiStateStore!.groupExists}
      groupError={uiStateStore!.groupError}
      dialogType={uiStateStore!.groupDialogType}
      handleClearError={() => uiStateStore!.setGroupError(undefined)}
      handleGroupExists={(groupName: string) => signalrStore!.groupExists(groupName)}
      initialValues={initialValues}
      onClose={() => uiStateStore!.setGroupDialogOpen(false)}
      onSubmit={(group: IGroupForm) => onSubmit(group)}
      loading={
        uiStateStore!.joiningGroup || uiStateStore!.leavingGroup || uiStateStore!.creatingGroup
      }
    />
  );
};

export default inject('uiStateStore', 'signalrStore')(observer(CreateGroupDialogContainer));
