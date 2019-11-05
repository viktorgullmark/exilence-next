import React, { useState } from 'react';
import Header from './Header';
import { observer, inject } from 'mobx-react';
import { UiStateStore } from './../../store/uiStateStore';

interface HeaderContainerProps {
  uiStateStore?: UiStateStore;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({
  uiStateStore
}: HeaderContainerProps) => {
  const [maximized, setMaximized] = useState(false);
  return (
    <Header
      maximized={maximized}
      setMaximized={setMaximized}
      sidenavOpened={uiStateStore!.sidenavOpen}
      toggleSidenav={() => uiStateStore!.toggleSidenav()}
    ></Header>
  );
};

export default inject('uiStateStore')(observer(HeaderContainer));
