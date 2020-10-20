import React, { useState } from 'react';
import GroupOverview from './GroupOverview';
import { observer, inject } from 'mobx-react';
import { UiStateStore } from '../../../store/uiStateStore';
import { SignalrStore } from '../../../store/signalrStore';
import ConfirmationDialog from '../../confirmation-dialog/ConfirmationDialog';
import { useTranslation } from 'react-i18next';

type GroupOverviewContainerProps = {
  uiStateStore?: UiStateStore;
  signalrStore?: SignalrStore;
}

const GroupOverviewContainer = ({
  uiStateStore,
  signalrStore,
}: GroupOverviewContainerProps) => {
  const { t } = useTranslation();
  const [showLeaveGroupDialog, setShowLeaveGroupDialog] = useState(false);

  const handleLeaveGroup = () => {
    signalrStore!.leaveGroup();
    setShowLeaveGroupDialog(false);
  };

  return (
    <>
      <GroupOverview
        open={uiStateStore!.groupOverviewOpen}
        leavingGroup={uiStateStore!.leavingGroup}
        activeGroup={signalrStore!.activeGroup}
        toggleGroupOverview={() => uiStateStore!.toggleGroupOverview()}
        handleCreateGroup={() =>
          uiStateStore!.setGroupDialogOpen(true, 'create')
        }
        handleJoinGroup={() => uiStateStore!.setGroupDialogOpen(true, 'join')}
        handleLeaveGroup={() => setShowLeaveGroupDialog(true)}
      />
      <ConfirmationDialog
        show={showLeaveGroupDialog}
        onClose={() => setShowLeaveGroupDialog(false)}
        onConfirm={handleLeaveGroup}
        title={t('title.confirm_leave_group')}
        body={t('body.leave_group')}
        acceptButtonText={t('action.confirm')}
        cancelButtonText={t('action.cancel')}
      />
    </>
  );
};

export default inject(
  'uiStateStore',
  'signalrStore'
)(observer(GroupOverviewContainer));
