import React, { useState } from 'react';
import SideNav from './SideNav';
import { observer, inject } from 'mobx-react';
import { UiStateStore } from '../../store/uiStateStore';

interface SideNavContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  uiStateStore?: UiStateStore;
}

const SideNavContainer: React.FC<SideNavContainerProps> = ({
  uiStateStore,
  children
}: SideNavContainerProps) => {
  return (
    <SideNav
      open={uiStateStore!.sidenavOpen}
      toggleSidenav={() => uiStateStore!.toggleSidenav()}
    >
      {children}
    </SideNav>
  );
};

export default inject('uiStateStore')(observer(SideNavContainer));
