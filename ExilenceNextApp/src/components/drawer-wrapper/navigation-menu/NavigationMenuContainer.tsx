import React from 'react';
import NavigationMenu from './NavigationMenu';
import { observer, inject } from 'mobx-react';
import { UiStateStore } from '../../../store/uiStateStore';
import { RouteStore } from '../../../store/routeStore';

type NavigationMenuContainerProps = {
  uiStateStore?: UiStateStore;
  routeStore?: RouteStore;
}

const NavigationMenuContainer = ({
  uiStateStore,
  routeStore,
}: NavigationMenuContainerProps) => (
  <NavigationMenu
    open={uiStateStore!.sidenavOpen}
    toggleSidenav={() => uiStateStore!.toggleSidenav()}
    handleRedirect={(path) => routeStore!.redirect(path)}
  />
);

export default inject(
  'uiStateStore',
  'routeStore'
)(observer(NavigationMenuContainer));
