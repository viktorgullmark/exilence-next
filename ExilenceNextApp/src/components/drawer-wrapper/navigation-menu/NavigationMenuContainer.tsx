import React from 'react';
import { inject, observer } from 'mobx-react';

import { RouteStore } from '../../../store/routeStore';
import { UiStateStore } from '../../../store/uiStateStore';
import NavigationMenu from './NavigationMenu';

type NavigationMenuContainerProps = {
  uiStateStore?: UiStateStore;
  routeStore?: RouteStore;
};

const NavigationMenuContainer = ({ uiStateStore, routeStore }: NavigationMenuContainerProps) => (
  <NavigationMenu
    open={uiStateStore!.sidenavOpen}
    toggleSidenav={() => uiStateStore!.toggleSidenav()}
    handleRedirect={(path) => routeStore!.redirect(path)}
  />
);

export default inject('uiStateStore', 'routeStore')(observer(NavigationMenuContainer));
