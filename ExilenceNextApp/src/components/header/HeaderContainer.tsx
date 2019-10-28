import React, { useState } from 'react';
import Header from './Header';

const HeaderContainer: React.FC = () => {
  const [maximized, setMaximized] = useState(false);
  return (
    <Header maximized={maximized} setMaximized={setMaximized}></Header>
  );
}

export default HeaderContainer;
