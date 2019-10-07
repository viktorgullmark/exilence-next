import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom'
import Login from './routes/login/Login';
import App from './core/app/App';

import exilenceTheme from './assets/themes/exilence-theme';
import { responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Admin from './routes/admin/Admin';
import { userService } from './services/user.service';

import { Provider } from 'react-redux';
import configureStore from './store';

const theme = responsiveFontSizes(exilenceTheme());

const store = configureStore();

const routing = (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Router>
        <Route path="/" component={App} />
        <Redirect from="/" to="/admin" />
        <Route path="/login" component={Login} />
        <Route path="/admin" render={() => (
          !userService.isAuthorized() ? (
            <Redirect to="/login" />
          ) : (
              <Admin />
            )
        )} />
      </Router>
    </ThemeProvider>
  </Provider>
)
ReactDOM.render(routing, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
