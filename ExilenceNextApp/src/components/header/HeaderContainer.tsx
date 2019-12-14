import React, { useState } from 'react';
import Header from './Header';
import { observer, inject } from 'mobx-react';
import { UiStateStore } from './../../store/uiStateStore';
import { UpdateStore } from '../../store/updateStore';

interface HeaderContainerProps {
  uiStateStore?: UiStateStore;
  updateStore?: UpdateStore;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({
  uiStateStore,
  updateStore
}: HeaderContainerProps) => {
  const [maximized, setMaximized] = useState(false);
  return (
    <Header
      maximized={maximized}
      setMaximized={setMaximized}
      sidenavOpened={uiStateStore!.sidenavOpen}
      toggleSidenav={() => uiStateStore!.toggleSidenav()}
      currentVersion={updateStore!.currentVersion}
    ></Header>
  );
};

export default inject('uiStateStore', 'updateStore')(observer(HeaderContainer));
