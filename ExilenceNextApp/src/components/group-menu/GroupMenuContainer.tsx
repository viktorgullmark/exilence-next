import { inject, observer } from 'mobx-react';
import React from 'react';
import { UiStateStore } from '../../store/uiStateStore';
import GroupMenu from './GroupMenu';

interface Props {
  uiStateStore?: UiStateStore;
}

const GroupMenuContainer: React.FC<Props> = ({ uiStateStore }: Props) => {
  const open = Boolean(uiStateStore!.groupMenuAnchor);

  const handleMenuClose = () => {
    uiStateStore!.setGroupMenuAnchor(null);
  };

  const handleJoinGroup = () => {
    // todo: join group
    console.log('should join');
  };

  const handleCreateGroup = () => {
    // todo: join group
    console.log('should create');
  };

  return (
    <GroupMenu
      open={open}
      anchorEl={uiStateStore!.groupMenuAnchor}
      handleMenuClose={handleMenuClose}
      handleJoinGroup={handleJoinGroup}
      handleCreateGroup={handleCreateGroup}
    />
  );
};

export default inject('uiStateStore')(observer(GroupMenuContainer));
