import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import GlobalStyles from '../global-styles/GlobalStyles';
import HeaderContainer from '../../components/header/HeaderContainer';

const App: React.FC = () => {
  return (
    <div>
      <CssBaseline />
      <GlobalStyles />
      <HeaderContainer />
    </div>
  );
}

export default App;
