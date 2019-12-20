import React from 'react';
import CreateGroupDialog from './CreateGroupDialog';
import { inject, observer } from 'mobx-react';
import { UiStateStore } from '../../store/uiStateStore';

interface Props {
  uiStateStore?: UiStateStore;
}

const CreateGroupDialogContainer: React.FC<Props> = ({
  uiStateStore
}: Props) => {
  const onCreate = () => {
    console.log('should create grp');
  };
  return (
    <CreateGroupDialog
      show={uiStateStore!.createGroupDialogOpen}
      onClose={() => uiStateStore!.setCreateGroupDialogOpen(false)}
      onCreate={onCreate}
    />
  );
};

export default inject('uiStateStore')(observer(CreateGroupDialogContainer));
