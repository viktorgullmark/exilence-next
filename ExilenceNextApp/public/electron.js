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
  authWindow: { createAuthWindow },
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
    const appPath = app.getAppPath();
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
   * Authorization
   */
  createAuthWindow({ mainWindow: windows[mainWindow] });

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
if (!gotTheLock && !isDev) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (isDev) {
      windows[mainWindow].destroy();
    } else {
      // Someone tried to run a second instance, we should focus our window.
      if (windows[mainWindow]) {
        if (windows[mainWindow].isMinimized()) {
          windows[mainWindow].restore();
          windows[mainWindow].focus();
        } else {
          windows[mainWindow].show();
        }
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

  app.on('before-quit', () => {
    isQuitting = true;
  });
}
