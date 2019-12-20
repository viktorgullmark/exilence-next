import { inject, observer } from 'mobx-react';
import React from 'react';
import { UiStateStore } from '../../store/uiStateStore';
import GroupMenu from './GroupMenu';

interface Props {
  uiStateStore?: UiStateStore;
}

const GroupMenuContainer: React.FC<Props> = ({
  uiStateStore
}: Props) => {
  const open = Boolean(uiStateStore!.groupMenuAnchor);

  const handleMenuClose = () => {
    uiStateStore!.setGroupMenuAnchor(null);
  };

  return (
    <GroupMenu
      open={open}
      anchorEl={uiStateStore!.groupMenuAnchor}
      handleMenuClose={handleMenuClose}
      handleJoinGroupOpen={() => uiStateStore!.setJoinGroupDialogOpen(true)}
      handleCreateGroupOpen={() => uiStateStore!.setCreateGroupDialogOpen(true)}
    />
  );
};

export default inject('uiStateStore')(observer(GroupMenuContainer));
