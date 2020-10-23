import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Redirect, Route } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import localForage from 'localforage';
import { configure } from 'mobx';
import { enableLogging } from 'mobx-logger';
import { create } from 'mobx-persist';
import { Provider } from 'mobx-react';
import moment from 'moment';
import ua, { Visitor } from 'universal-analytics';

import exilenceTheme from './assets/themes/exilence-theme';
import DrawerWrapperContainer from './components/drawer-wrapper/DrawerWrapperContainer';
import GlobalStyles from './components/global-styles/GlobalStyles';
import HeaderContainer from './components/header/HeaderContainer';
import HighchartsTheme from './components/highcharts-theme/HighchartsTheme';
import Notifier from './components/notifier/Notifier';
import ReactionContainer from './components/reaction-container/ReactionContainer';
import SupportButton from './components/support-button/SupportButton';
import ToastWrapper from './components/toast-wrapper/ToastWrapper';
import ToolbarContainer from './components/toolbar/ToolbarContainer';
import AppConfig from './config/app.config';
import configureAxios from './config/axios';
import configureI18n from './config/i18n';
import initSentry from './config/sentry';
import Login from './routes/login/Login';
import NetWorth from './routes/net-worth/NetWorth';
import Settings from './routes/settings/Settings';
import { electronService } from './services/electron.service';
import { RootStore } from './store/rootStore';

import 'react-toastify/dist/ReactToastify.min.css';
import './assets/styles/reactour.scss';
export const appName = 'Exilence Next';
export let visitor: Visitor | undefined = undefined;

initSentry();
configureI18n();
configureAxios();
enableLogging({
  action: false,
  reaction: false,
  transaction: false,
  compute: false,
});

configure({ enforceActions: 'observed' });

moment.locale(electronService.remote.app.getLocale());

const theme = responsiveFontSizes(exilenceTheme());
export const rootStore: RootStore = new RootStore();

localForage.config({
  name: 'exilence-next-db',
  driver: localForage.INDEXEDDB,
});

const app = (
  <>
    <ThemeProvider theme={theme}>
      <Provider {...rootStore}>
        <Suspense fallback={null}>
          <Router>
            <HighchartsTheme />
            <CssBaseline />
            <GlobalStyles />
            <ToastWrapper />
            <Route path="/login" component={Login} />
            <HeaderContainer />
            <DrawerWrapperContainer>
              <ToolbarContainer />
              <SupportButton />
              <Route path="/net-worth" component={NetWorth} />
              <Route path="/settings" component={Settings} />
              <Route
                exact
                path="/"
                render={() =>
                  rootStore.accountStore.getSelectedAccount.name ? (
                    <Redirect to="/net-worth" />
                  ) : (
                    <Redirect to="/login" />
                  )
                }
              />
            </DrawerWrapperContainer>
            <Notifier />
            <ReactionContainer />
          </Router>
        </Suspense>
      </Provider>
    </ThemeProvider>
  </>
);

const hydrate = create({
  storage: localForage,
  jsonify: true,
});

const renderApp = () => {
  Promise.all([
    hydrate('account', rootStore.accountStore),
    hydrate('uiState', rootStore.uiStateStore),
    hydrate('league', rootStore.leagueStore),
    hydrate('setting', rootStore.settingStore),
  ]).then(() => {
    rootStore.settingStore.setUiScale(rootStore.settingStore.uiScale);
    visitor = ua(AppConfig.trackingId, rootStore.uiStateStore.userId);
    ReactDOM.render(app, document.getElementById('root'));
  });
};

hydrate('migration', rootStore.migrationStore).then(() => {
  if (rootStore.migrationStore.current < rootStore.migrationStore.latest) {
    rootStore.migrationStore.runMigrations().subscribe(() => renderApp());
  } else {
    renderApp();
  }
});
