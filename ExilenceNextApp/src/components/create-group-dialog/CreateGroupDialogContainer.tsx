import React from 'react';
import CreateGroupDialog from './CreateGroupDialog';
import { inject, observer } from 'mobx-react';
import { UiStateStore } from '../../store/uiStateStore';

interface Props {
  uiStateStore?: UiStateStore;
}

export interface ICreateGroupForm {
  name: string;
  password: string;
}

const CreateGroupDialogContainer: React.FC<Props> = ({
  uiStateStore
}: Props) => {
  const initialValues: ICreateGroupForm = {
    name: '',
    password: ''
  };

  const onCreate = () => {
    console.log('should create grp');
  };
  return (
    <CreateGroupDialog
      show={uiStateStore!.createGroupDialogOpen}
      initialValues={initialValues}
      onClose={() => uiStateStore!.setCreateGroupDialogOpen(false)}
      onCreate={onCreate}
    />
  );
};

export default inject('uiStateStore')(observer(CreateGroupDialogContainer));
