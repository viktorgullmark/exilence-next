import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../..';
import RemoveSnapshotsDialog from './RemoveSnapshotsDialog';

const RemoveSnapshotsDialogContainer = () => {
  const { uiStateStore, accountStore } = useStores();

  const profile = accountStore.getSelectedAccount.activeProfile;
  const snapshots = profile?.snapshots ?? [];

  const handleSubmit = (snapshotIds: string[]) => {
    if (profile?.snapshots) {
      profile.removeSnapshots(snapshotIds);
      uiStateStore!.setRemoveSnapshotsDialogOpen(false);
    }
  };

  return (
    <>
      {uiStateStore!.removeSnapshotsDialogOpen && (
        <RemoveSnapshotsDialog
          loading={false}
          snapshots={snapshots}
          handleSubmit={handleSubmit}
          show={uiStateStore!.removeSnapshotsDialogOpen}
          onClose={() => uiStateStore!.setRemoveSnapshotsDialogOpen(false)}
        />
      )}
    </>
  );
};

export default observer(RemoveSnapshotsDialogContainer);
