import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../..';
import ManualAdjustmentDialog from './ManualAdjustmentDialogDialog';

const ManualAdjustmentDialogContainer = () => {
  const { uiStateStore, accountStore } = useStores();

  const session = accountStore.getSelectedAccount.activeProfile?.session;

  const handleSubmit = (offsetTime: number) => {
    if (!session) return;
    session.addManualAdjustment(offsetTime);
  };

  const handleReset = () => {
    if (!session) return;
    session.addManualAdjustment(-session.offsetManualAdjustment);
  };

  return (
    <>
      {uiStateStore!.manualAdjustmentsOpen && (
        <ManualAdjustmentDialog
          show={uiStateStore!.manualAdjustmentsOpen}
          loading={false}
          offsetManualAdjustment={session?.offsetManualAdjustment}
          handleSubmit={handleSubmit}
          handleReset={handleReset}
          handleClose={() => uiStateStore!.toggleManualAdjustment(false)}
        />
      )}
    </>
  );
};

export default observer(ManualAdjustmentDialogContainer);
