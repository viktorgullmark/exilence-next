import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';

import { UpdateStore } from '../../store/updateStore';
import Header from './Header';

type HeaderContainerProps = {
  updateStore?: UpdateStore;
};

const HeaderContainer = ({ updateStore }: HeaderContainerProps) => {
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

export default inject('updateStore')(observer(HeaderContainer));
