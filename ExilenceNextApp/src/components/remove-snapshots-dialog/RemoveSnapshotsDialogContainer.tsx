import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../..';
import RemoveSnapshotsDialog from './RemoveSnapshotsDialog';

const RemoveSnapshotsDialogContainer = () => {
  const { uiStateStore, accountStore } = useStores();

  const profile = accountStore.getSelectedAccount.activeProfile;
  const snapshots = profile?.snapshots ?? [];
  const sessionSnapshots = profile?.session.snapshots ?? [];

  const handleSubmit = (snapshotIds: string[]) => {
    if (profile?.snapshots) {
      profile.removeSnapshots(snapshotIds.filter((s) => !s.startsWith('_ss_')));
      uiStateStore!.setRemoveSnapshotsDialogOpen(false);
    }
    if (profile?.session.snapshots) {
      profile.session.removeSnapshots(
        snapshotIds.filter((s) => s.startsWith('_ss_')).map((s) => s.substring(4))
      );
    }
  };

  return (
    <>
      {uiStateStore!.removeSnapshotsDialogOpen && (
        <RemoveSnapshotsDialog
          loading={false}
          snapshots={snapshots}
          sessionSnapshots={sessionSnapshots}
          handleSubmit={handleSubmit}
          show={uiStateStore!.removeSnapshotsDialogOpen}
          onClose={() => uiStateStore!.setRemoveSnapshotsDialogOpen(false)}
        />
      )}
    </>
  );
};

export default observer(RemoveSnapshotsDialogContainer);
