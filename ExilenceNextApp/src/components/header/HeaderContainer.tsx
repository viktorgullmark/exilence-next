import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useStores } from '../..';
import Header from './Header';

const HeaderContainer = () => {
  const { updateStore } = useStores();

  const [maximized, setMaximized] = useState(false);
  return (
    <Header
      maximized={maximized}
      setMaximized={setMaximized}
      currentVersion={updateStore!.currentVersion}
      updateAvailable={updateStore!.updateAvailable}
      quitAndInstall={() => updateStore!.quitAndInstall()}
    />
  );
};

export default observer(HeaderContainer);
