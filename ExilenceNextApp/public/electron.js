const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const sentry = require('@sentry/electron');
const windowStateKeeper = require('electron-window-state');
const contextMenu = require('electron-context-menu');

const {
  flashFrame: { createFlashFrame },
  logMonitor: { createLogMonitor },
  autoUpdater: { checkForUpdates, createAutoUpdater },
  tray: { createTray },
  netWorthOverlay: { createNetWorthOverlay, destroyNetWorthOverlayWindow },
  menuFunctions: { menuFunctions },
  session: { createSession },
  localSettings: { loadLocalSettings, getLocalSettings },
} = require('./main');

if (!isDev) {
  sentry.init({
    dsn: 'https://123362e387b749feaf8f98a2cce30fdf@sentry.io/1852797',
  });
}

/**
 * Initial Declarations
 */
const mainWindow = 'main';
const gotTheLock = app.requestSingleInstanceLock();
let windows = [];
let isQuitting;
let updateAvailable;
let trayProps;
let deeplinkingUrl;

/**
 * Local Settings
 */
loadLocalSettings();

/**
 * Overlays
 */
createNetWorthOverlay();

/**
 * Main Window
 */
function createWindow() {
  const minMainWindowWidth = 800;
  const minMainWindowHeight = 800;
  const { width: defaultWidth, height: defaultHeight } = screen.getPrimaryDisplay().workAreaSize;

  const { x, y, width, height, manage } = windowStateKeeper({
    defaultWidth,
    defaultHeight,
    file: mainWindow,
  });

  windows[mainWindow] = new BrowserWindow({
    x,
    y,
    width,
    height,
    minWidth: minMainWindowWidth,
    minHeight: minMainWindowHeight,
    webPreferences: { webSecurity: false, nodeIntegration: true, contextIsolation: false },
    frame: false,
  });

  manage(windows[mainWindow]);

  isDev
    ? windows[mainWindow].loadURL('http://localhost:3000')
    : windows[mainWindow].loadFile(path.resolve(__dirname, '../build/index.html'));

  windows[mainWindow].on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      windows[mainWindow].hide();
      e.returnValue = false;
    }
  });

  /**
   * Tray
   */
  trayProps = {
    mainWindow: windows[mainWindow],
    updateAvailable,
    isQuittingCallback: (status) => (isQuitting = status),
  };

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
  ipcMain.on('close-overlay', (_event, overlayName) => {
    switch (overlayName) {
      case 'networth':
        destroyNetWorthOverlayWindow();
        break;
      default:
        destroyNetWorthOverlayWindow();
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
   * Flash Frames
   */
  createFlashFrame({ event: 'notify', mainWindow: windows[mainWindow] });

  /**
   * Log Monitors
   */
  createLogMonitor({ mainWindow: windows[mainWindow] });

  /**
   * Auto Updater
   */
  createAutoUpdater({
    mainWindow: windows[mainWindow],
    callbackUpdateAvailable: (status) => (updateAvailable = status),
  });

  /**
   * Menu Functions
   */
  menuFunctions({ mainWindow: windows[mainWindow] });

  if (isDev) {
    // Provide Inspect Element option on right click
    contextMenu();
  }
}

/**
 * App Listeners
 */
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_, argv) => {
    // Someone tried to run a second instance, we should focus our window.
    if (windows[mainWindow]) {
      // Protocol handler for win32 || linux
      // argv: An array of the second instance’s (command line / deep linked) arguments
      if (process.platform !== 'darwin') {
        // Keep only command line / deep linked arguments
        deeplinkingUrl = argv.slice(1);
        const raw_code = /code=([^&]*)/.exec(deeplinkingUrl) || null;
        const code = raw_code && raw_code.length > 1 ? raw_code[1] : null;
        const error = /\?error=(.+)$/.exec(deeplinkingUrl);
        windows[mainWindow].webContents.send('auth-callback', {code, error});
      }

      if (windows[mainWindow].isMinimized()) {
        windows[mainWindow].restore();
        windows[mainWindow].focus();
      } else {
        windows[mainWindow].show();
      }
    }
  });

  app.whenReady().then(async () => {
    await createWindow();
    await createTray(trayProps);
    await checkForUpdates();
  });

  app.on('activate', async () => {
    if (windows[mainWindow] === null) {
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
    windows[mainWindow].webContents.send('auth-callback', { code, error });
  });

  if(isDev || process.platform !== 'darwin') {
    app.setAsDefaultProtocolClient('exilence', process.execPath, [path.resolve(process.argv[1])]);
  } else {
    app.setAsDefaultProtocolClient('exilence');
  }

  app.on('before-quit', () => {
    isQuitting = true;
  });
}
