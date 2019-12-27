import React from 'react';
import GroupOverview from './GroupOverview';
import { observer, inject } from 'mobx-react';
import { UiStateStore } from '../../../store/uiStateStore';

interface GroupOverviewContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  uiStateStore?: UiStateStore;
}

const GroupOverviewContainer: React.FC<GroupOverviewContainerProps> = ({
  uiStateStore,
  children
}: GroupOverviewContainerProps) => {
  return (
    <GroupOverview
      open={uiStateStore!.groupOverviewOpen}
      toggleGroupOverview={() => uiStateStore!.toggleGroupOverview()}
      handleCreateGroup={() => uiStateStore!.setGroupDialogOpen(true, 'create')}
      handleJoinGroup={() => uiStateStore!.setGroupDialogOpen(true, 'join')}
    >
      {children}
    </GroupOverview>
  );
};

export default inject('uiStateStore')(observer(GroupOverviewContainer));
