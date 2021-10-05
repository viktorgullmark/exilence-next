import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../..';
import ConfirmationDialog from '../../confirmation-dialog/ConfirmationDialog';
import GroupOverview from './GroupOverview';

const GroupOverviewContainer = () => {
  const { uiStateStore, signalrStore } = useStores();
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
        handleCreateGroup={() => uiStateStore!.setGroupDialogOpen(true, 'create')}
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

export default observer(GroupOverviewContainer);
