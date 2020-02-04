import { inject, observer } from 'mobx-react';
import React, { useState } from 'react';
import { UpdateStore } from '../../store/updateStore';
import Header from './Header';

interface HeaderContainerProps {
  updateStore?: UpdateStore;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({
  updateStore
}: HeaderContainerProps) => {
  const [maximized, setMaximized] = useState(false);
  return (
    <Header
      maximized={maximized}
      setMaximized={setMaximized}
      currentVersion={updateStore!.currentVersion}
      updateAvailable={updateStore!.updateAvailable}
      quitAndInstall={() => updateStore!.quitAndInstall()}
    ></Header>
  );
};

export default inject('updateStore')(observer(HeaderContainer));
