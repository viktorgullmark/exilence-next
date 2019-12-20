import { inject, observer } from 'mobx-react';
import React from 'react';
import { UiStateStore } from '../../store/uiStateStore';
import GroupMenu from './GroupMenu';

interface Props {
  uiStateStore?: UiStateStore;
  handleJoinGroupOpen: () => void;
  handleCreateGroupOpen: () => void;
}

const GroupMenuContainer: React.FC<Props> = ({
  uiStateStore,
  handleJoinGroupOpen,
  handleCreateGroupOpen
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
      handleJoinGroupOpen={handleJoinGroupOpen}
      handleCreateGroupOpen={handleCreateGroupOpen}
    />
  );
};

export default inject('uiStateStore')(observer(GroupMenuContainer));
