import React, { Suspense, useEffect } from 'react';
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
import AnnouncementDialogContainer from './components/announcement-dialog/AnnouncementDialogContainer';
export const appName = 'Exilence Next';
export let visitor: Visitor | undefined = undefined;
import useStyles from './index.styles';

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

moment.locale(electronService.appLocale);

const theme = responsiveFontSizes(exilenceTheme());
export const rootStore: RootStore = new RootStore();

localForage.config({
  name: 'exilence-next-db',
  driver: localForage.INDEXEDDB,
});

const App = () => {
  const classes = useStyles();
  useEffect(() => {
    const preload = document.getElementById('preload');
    if (preload) preload.remove();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Provider {...rootStore}>
        <Suspense fallback={null}>
          <Router>
            <div className={classes.app}>
              <HighchartsTheme />
              <CssBaseline />
              <GlobalStyles />
              <ToastWrapper />
              <Route path="/login" component={Login} />
              <HeaderContainer />
              <DrawerWrapperContainer>
                <ToolbarContainer />
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
              <AnnouncementDialogContainer />
            </div>
          </Router>
        </Suspense>
      </Provider>
    </ThemeProvider>
  );
};

const hydrate = create({
  storage: localForage,
  jsonify: true,
});

const renderApp = () => {
  Promise.all([
    hydrate('account', rootStore.accountStore),
    hydrate('customPrice', rootStore.customPriceStore),
    hydrate('uiState', rootStore.uiStateStore),
    hydrate('league', rootStore.leagueStore),
    hydrate('setting', rootStore.settingStore),
  ]).then(() => {
    rootStore.settingStore.setUiScale(rootStore.settingStore.uiScale);
    visitor = ua(AppConfig.trackingId, rootStore.uiStateStore.userId);
    ReactDOM.render(<App />, document.getElementById('root'));
  });
};

hydrate('migration', rootStore.migrationStore).then(() => {
  if (rootStore.migrationStore.current < rootStore.migrationStore.latest) {
    rootStore.migrationStore.runMigrations().subscribe(() => renderApp());
  } else {
    renderApp();
  }
});
