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
import { userService } from './services/user.service';
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
