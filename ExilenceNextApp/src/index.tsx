import { responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import exilenceTheme from './assets/themes/exilence-theme';
import App from './core/app/App';
import Admin from './routes/admin/Admin';
import Login from './routes/login/Login';
import configureStore from './store';
import { PersistGate } from 'redux-persist/integration/react';

const theme = responsiveFontSizes(exilenceTheme());

const { store, persistor } = configureStore();

const routing = (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <Router>
          <Route path="/" component={App} />
          <Redirect from="/" to="/admin" />
          <Route path="/login" component={Login} />
          <Route path="/admin" render={() => (
            // todo: implement proper auth check
            false ? (
              <Redirect to="/login" />
            ) : (
                <Admin />
              )
          )} />
        </Router>
      </ThemeProvider>
    </PersistGate>
  </Provider >
)
ReactDOM.render(routing, document.getElementById('root'))
