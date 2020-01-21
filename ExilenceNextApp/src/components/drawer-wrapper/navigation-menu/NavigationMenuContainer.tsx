import React from 'react';
import NavigationMenu from './NavigationMenu';
import { observer, inject } from 'mobx-react';
import { UiStateStore } from '../../../store/uiStateStore';

interface NavigationMenuContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  uiStateStore?: UiStateStore;
}

const NavigationMenuContainer: React.FC<NavigationMenuContainerProps> = ({
  uiStateStore,
  children
}: NavigationMenuContainerProps) => {
  return (
    <NavigationMenu
      open={uiStateStore!.sidenavOpen}
      toggleSidenav={() => uiStateStore!.toggleSidenav()}
    >
      {children}
    </NavigationMenu>
  );
};

export default inject('uiStateStore')(observer(NavigationMenuContainer));
