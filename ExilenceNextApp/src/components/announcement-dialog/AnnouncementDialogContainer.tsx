import { inject, observer } from 'mobx-react';
import React from 'react';
import { UiStateStore } from '../../store/uiStateStore';
import AnnouncementDialog from './AnnouncementDialog';

type AnnouncementDialogContainerProps = {
  uiStateStore?: UiStateStore;
};

const AnnouncementDialogContainer = ({ uiStateStore }: AnnouncementDialogContainerProps) => {
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

export default inject('uiStateStore')(observer(AnnouncementDialogContainer));
