import React from 'react';
import NavigationMenu from './NavigationMenu';
import { observer, inject } from 'mobx-react';
import { UiStateStore } from '../../../store/uiStateStore';
import { RouteStore } from '../../../store/routeStore';

interface NavigationMenuContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  uiStateStore?: UiStateStore;
  routeStore?: RouteStore;
}

const NavigationMenuContainer: React.FC<NavigationMenuContainerProps> = ({
  uiStateStore,
  routeStore,
  children
}: NavigationMenuContainerProps) => {
  return (
    <NavigationMenu
      open={uiStateStore!.sidenavOpen}
      toggleSidenav={() => uiStateStore!.toggleSidenav()}
      handleRedirect={(path: string) => routeStore!.redirect(path)}
    >
      {children}
    </NavigationMenu>
  );
};

export default inject(
  'uiStateStore',
  'routeStore'
)(observer(NavigationMenuContainer));
