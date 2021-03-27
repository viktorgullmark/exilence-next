import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../../..';
import NavigationMenu from './NavigationMenu';

const NavigationMenuContainer = () => {
  const { uiStateStore, routeStore } = useStores();

  return (
    <NavigationMenu
      open={uiStateStore!.sidenavOpen}
      toggleSidenav={() => uiStateStore!.toggleSidenav()}
      handleRedirect={(path) => routeStore!.redirect(path)}
    />
  );
};

export default observer(NavigationMenuContainer);
