import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import * as sentry from '@sentry/electron';
import * as windowStateKeeper from 'electron-window-state';

import {
  createFlashFrame,
  createLogMonitorOverlay,
  createAutoUpdater,
  checkForUpdates,
  createTray,
  CreateTrayProps,
  createNetWorthOverlay,
  destroyNetWorthOverlay,
  menuFunctions,
  createSession,
  loadLocalSettings,
  getLocalSettings,
  destroyLogMonitorOverlay,
  destroyTray,
} from './main/index';

import {
  browserWindows,
  browserWindowsConfig,
  MAIN_BROWSER_WINDOW,
  NET_WORTH_OVERLAY,
} from './browserWindows';
import { SYSTEMS } from './enums';

if (!isDev) {
  sentry.init({
    dsn: 'https://cefd9ca960954f39870e162aa8936535@o222604.ingest.sentry.io/6011593',
    ignoreErrors: [
      'Request failed',
      'net::',
      'Network Error',
      'HttpError',
      'https://www.pathofexile.com',
      'https://api.pathofexile.com',
      'https://poe.ninja',
      'https://github.com',
    ],
  });
}

/**
 * Initial Declarations
 */
const gotTheLock = app.requestSingleInstanceLock();
let isQuitting: boolean;
let updateAvailable: boolean;
let deeplinkingUrl: any;
let trayProps: CreateTrayProps;

/**
 * Local Settings
 */
loadLocalSettings();

/**
 * Main Window
 */
function createWindow() {
  const { width: defaultWidth, height: defaultHeight } = screen.getPrimaryDisplay().workAreaSize;

  const { x, y, width, height, manage } = windowStateKeeper({
    defaultWidth,
    defaultHeight,
    file: MAIN_BROWSER_WINDOW,
  });

  browserWindows[MAIN_BROWSER_WINDOW] = new BrowserWindow({
    x,
    y,
    width,
    height,
    minWidth: browserWindowsConfig[MAIN_BROWSER_WINDOW].width,
    minHeight: browserWindowsConfig[MAIN_BROWSER_WINDOW].height,
    webPreferences: { webSecurity: false, nodeIntegration: true, contextIsolation: false },
    frame: false,
    show: false,
  });

  manage(browserWindows[MAIN_BROWSER_WINDOW]);

  isDev
    ? browserWindows[MAIN_BROWSER_WINDOW].loadURL(
        browserWindowsConfig[MAIN_BROWSER_WINDOW].devLoadPath
      )
    : browserWindows[MAIN_BROWSER_WINDOW].loadFile(
        browserWindowsConfig[MAIN_BROWSER_WINDOW].prodLoadPath
      );

  browserWindows[MAIN_BROWSER_WINDOW].on('close', (e: Event) => {
    if (getLocalSettings().appExitAction === 'exit') return;
    if (!isQuitting) {
      e.preventDefault();
      browserWindows[MAIN_BROWSER_WINDOW].hide();
      e.returnValue = false;
    }
  });

  /**
   * Expose main process variables
   */
  ipcMain.on('app-globals', (e) => {
    const localSettings = getLocalSettings();
    const appPath = __dirname;
    const appLocale = app.getLocale();

    e.returnValue = {
      localSettings,
      appPath,
      appLocale,
    };
  });

  /**
   * Session handlers
   */
  createSession();

  /**
   * Generic overlay helper functions
   */
  ipcMain.on('close-overlay', (_event, { overlay }) => {
    switch (overlay) {
      case NET_WORTH_OVERLAY:
        return destroyNetWorthOverlay();
      default:
        return;
    }
  });

  /**
   * Window handlers
   */
  ipcMain.handle('restart', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      app.relaunch();
      app.exit(0);
      e.returnValue = false;
    }
  });

  /**
   * Tray
   */
  trayProps = {
    mainWindow: browserWindows[MAIN_BROWSER_WINDOW],
    updateAvailable,
    isQuittingCallback: (status) => (isQuitting = status),
  };

  /**
   * Menu Functions
   */
  menuFunctions({ mainWindow: browserWindows[MAIN_BROWSER_WINDOW] });

  /**
   * Flash Frames
   */
  createFlashFrame({ mainWindow: browserWindows[MAIN_BROWSER_WINDOW] });

  /**
   * Log Monitors
   */
  createLogMonitorOverlay({ mainWindow: browserWindows[MAIN_BROWSER_WINDOW] });

  /**
   * Auto Updater
   */
  createAutoUpdater({
    mainWindow: browserWindows[MAIN_BROWSER_WINDOW],
    callbackUpdateAvailable: (status) => (updateAvailable = status),
  });

  /**
   * Overlays
   */
  createNetWorthOverlay();

  if (isDev) {
    browserWindows[MAIN_BROWSER_WINDOW].webContents.openDevTools();
    // Hot Reloading on 'node_modules/.bin/electronPath'
    require('electron-reload')(__dirname, {
      electron: path.join(
        __dirname,
        '..',
        '..',
        'node_modules',
        '.bin',
        'electron' + (process.platform === SYSTEMS.WINDOWS ? '.cmd' : '')
      ),
      forceHardReset: true,
      hardResetMethod: 'exit',
    });
  }

  if (browserWindows[MAIN_BROWSER_WINDOW] instanceof BrowserWindow) {
    browserWindows[MAIN_BROWSER_WINDOW].once('ready-to-show', () => {
      browserWindows[MAIN_BROWSER_WINDOW].show();
    });
  }
}

if (isDev && process.platform !== SYSTEMS.MACOS) {
  app.setAsDefaultProtocolClient('exilence', process.execPath, [path.resolve(process.argv[1])]);
} else {
  app.setAsDefaultProtocolClient('exilence');
}

/**
 * App Listeners
 */
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_, argv) => {
    // Someone tried to run a second instance, we should focus our window.
    if (browserWindows[MAIN_BROWSER_WINDOW]) {
      // Protocol handler for win32 || linux
      // argv: An array of the second instance’s (command line / deep linked) arguments
      if (process.platform !== SYSTEMS.MACOS) {
        // Keep only command line / deep linked arguments
        deeplinkingUrl = argv.slice(1);
        const raw_code = /code=([^&]*)/.exec(deeplinkingUrl) || null;
        const code = raw_code && raw_code.length > 1 ? raw_code[1] : null;
        const error = /\?error=(.+)$/.exec(deeplinkingUrl);
        browserWindows[MAIN_BROWSER_WINDOW].webContents.send('auth-callback', { code, error });
      }

      if (browserWindows[MAIN_BROWSER_WINDOW].isMinimized()) {
        browserWindows[MAIN_BROWSER_WINDOW].restore();
        browserWindows[MAIN_BROWSER_WINDOW].focus();
      } else {
        browserWindows[MAIN_BROWSER_WINDOW].show();
      }
    }
  });

  app.whenReady().then(async () => {
    await createWindow();
    await createTray(trayProps);
    if (!isDev) await checkForUpdates();
  });

  app.on('activate', async () => {
    if (browserWindows[MAIN_BROWSER_WINDOW] === null) {
      await createWindow();
      await createTray(trayProps);
    }
  });

  app.on('open-url', function (event, data) {
    event.preventDefault();
    deeplinkingUrl = data;
    const raw_code = /code=([^&]*)/.exec(deeplinkingUrl) || null;
    const code = raw_code && raw_code.length > 1 ? raw_code[1] : null;
    const error = /\?error=(.+)$/.exec(deeplinkingUrl);
    browserWindows[MAIN_BROWSER_WINDOW].webContents.send('auth-callback', { code, error });
  });

  app.on('before-quit', () => {
    destroyNetWorthOverlay();
    destroyLogMonitorOverlay();
    destroyTray();
    isQuitting = true;
  });
}
