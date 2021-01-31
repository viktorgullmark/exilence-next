const { app, BrowserWindow, screen, session, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
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
 * Overlays
 */
createNetWorthOverlay();

/**
 * Main Window
 */
function createWindow() {
  const size = screen.getPrimaryDisplay().workAreaSize;

  const mainWindowState = windowStateKeeper({
    defaultWidth: size.width,
    defaultHeight: size.height,
    file: 'main',
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

  /**
   * Expose main process variables
   */
  ipcMain.on('app-globals', (e) => {
    const appPath = app.getAppPath();
    const appLocale = app.getLocale();

    e.returnValue = {
      appPath,
      appLocale,
    };
  });

  /**
   * Session handlers
   */
  ipcMain.handle('set-cookie', (_event, arg) => {
    return session.defaultSession.cookies.set(arg);
  });

  ipcMain.handle('get-cookie', (_event, arg) => {
    return session.defaultSession.cookies.get(arg);
  });

  ipcMain.handle('remove-cookie', (_event, url, id) => {
    return session.defaultSession.cookies.remove(url, id);
  });

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
   * Authorization
   */
  ipcMain.on('create-auth-window', (_event, args) => {
    createAuthWindow({ mainWindow: windows[mainWindow], options: args });
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
