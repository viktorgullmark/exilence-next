import { observer } from 'mobx-react-lite';
import moment from 'moment';
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

  const manualAdjustment = session?.offsetManualAdjustment
    ? moment.duration(Math.abs(session.offsetManualAdjustment))
    : null;

  const isAdjustmentNegativ = session?.offsetManualAdjustment
    ? session.offsetManualAdjustment > 0
    : false;

  return (
    <>
      {uiStateStore!.manualAdjustmentsOpen && (
        <ManualAdjustmentDialog
          show={uiStateStore!.manualAdjustmentsOpen}
          loading={false}
          manualAdjustment={manualAdjustment}
          isAdjustmentNegativ={isAdjustmentNegativ}
          handleSubmit={handleSubmit}
          handleReset={handleReset}
          handleClose={() => uiStateStore!.toggleManualAdjustment(false)}
        />
      )}
    </>
  );
};

export default observer(ManualAdjustmentDialogContainer);
