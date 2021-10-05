import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../..';
import AnnouncementDialog from './AnnouncementDialog';

const AnnouncementDialogContainer = () => {
  const { uiStateStore } = useStores();
  return (
    <>
      {uiStateStore!.announcementMessage && (
        <AnnouncementDialog
          show={uiStateStore!.announcementDialogOpen}
          onClose={() => uiStateStore!.setAnnouncementDialogOpen(false)}
          announcement={uiStateStore!.announcementMessage}
        />
      )}
    </>
  );
};

export default observer(AnnouncementDialogContainer);
