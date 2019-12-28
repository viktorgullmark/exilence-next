import React from 'react';
import GroupDialog from './GroupDialog';
import { inject, observer } from 'mobx-react';
import { UiStateStore } from '../../store/uiStateStore';
import { generateGroupName } from '../../utils/group.utils';

interface Props {
  uiStateStore?: UiStateStore;
}

export interface IGroupForm {
  name: string;
  password: string;
}

const CreateGroupDialogContainer: React.FC<Props> = ({
  uiStateStore
}: Props) => {
  const initialValues: IGroupForm = {
    name: generateGroupName(),
    password: ''
  };

  const onSubmit = (group: IGroupForm) => {
    console.log('group', group);
    console.log('create', uiStateStore!.groupDialogType)
  };

  return (
    <GroupDialog
      show={uiStateStore!.groupDialogOpen}
      initialValues={initialValues}
      onClose={() => uiStateStore!.setGroupDialogOpen(false)}
      onSubmit={(group: IGroupForm) => onSubmit(group)}
    />
  );
};

export default inject('uiStateStore')(observer(CreateGroupDialogContainer));
