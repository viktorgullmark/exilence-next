const { app, BrowserWindow, screen } = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const sentry = require('@sentry/electron');
const windowStateKeeper = require('electron-window-state');
const {
  flashFrame: { createFlashFrame },
  logMonitor: { createLogMonitor },
  autoUpdater: { checkForUpdates, createAutoUpdater },
  tray: { createTray },
  netWorthOverlay: { createNetWorthOverlay }
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
const gotTheLock = app.requestSingleInstanceLock()
let windows = [];
let isQuitting;
let updateAvailable;
let trayProps;

/**
 * Flash Frames
 */
createFlashFrame({ event: 'notify', mainWindow: windows[mainWindow] });

/**
 * Log Monitors
 */
createLogMonitor({ mainWindow: windows[mainWindow] });

/**
 * Overlays
 */
createNetWorthOverlay();

/**
 * Auto Updater
 */
createAutoUpdater({
  mainWindow: windows[mainWindow],
  callbackUpdateAvailable: (status) => (updateAvailable = status),
});

/**
 * Main Window
 */
function createWindow() {
  const size = screen.getPrimaryDisplay().workAreaSize;

  const mainWindowState = windowStateKeeper({
    defaultWidth: size.width,
    defaultHeight: size.height,
  });

  windows[mainWindow] = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 800,
    minHeight: 800,
    webPreferences: { webSecurity: false, nodeIntegration: true },
    frame: false,
  });

  mainWindowState.manage(windows[mainWindow]);

  windows[mainWindow].loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
  );

  windows[mainWindow].on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      windows[mainWindow].hide();
      e.returnValue = false;
    }
  });

  trayProps = {
    mainWindow: windows[mainWindow],
    updateAvailable,
    isQuittingCallback: (status) => (isQuitting = status),
  };
}

/**
 * App Listeners
 */

if(!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (windows[mainWindow]) {
      if (windows[mainWindow].isMinimized()) windows[mainWindow].restore()
      windows[mainWindow].focus()
    }
  })


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

  app.on('before-quit', () => {
    isQuitting = true;
  });
}