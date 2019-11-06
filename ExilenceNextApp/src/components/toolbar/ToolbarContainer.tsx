import React, { useState } from 'react';
import Toolbar from './Toolbar';
import { observer, inject } from 'mobx-react';
import { UiStateStore } from './../../store/uiStateStore';

interface ToolbarContainerProps {
  uiStateStore?: UiStateStore;
}

const ToolbarContainer: React.FC<ToolbarContainerProps> = ({
  uiStateStore
}: ToolbarContainerProps) => {
  return (
    <Toolbar
      sidenavOpened={uiStateStore!.sidenavOpen}
      toggleSidenav={() => uiStateStore!.toggleSidenav()}
    />
  );
};

export default inject('uiStateStore')(observer(ToolbarContainer));
