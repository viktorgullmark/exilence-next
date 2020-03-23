const electron = require('electron');
const ipcMain = require('electron').ipcMain;
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const sentry = require('@sentry/electron');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const windowStateKeeper = require('electron-window-state');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let shouldNotify = true;

if (!isDev) {
  sentry.init({
    dsn: 'https://123362e387b749feaf8f98a2cce30fdf@sentry.io/1852797'
  });
}

const windows = [];

function sendStatusToWindow(text) {
  log.info(text);
  windows['main'].webContents.send('message', text);
}

ipcMain.on('checkForUpdates', function(event) {
  if (shouldNotify) {
    autoUpdater.checkForUpdatesAndNotify();
  } else {
    autoUpdater.checkForUpdates();
  }
});

ipcMain.on('quitAndInstall', function(event) {
  autoUpdater.quitAndInstall();
});

ipcMain.on('notify', function(event) {
  windows['main'].flashFrame(true);
});

/*    OVERLAY    */

ipcMain.on('createOverlay', (event, data) => {
  const window = data.event;

  if (windows[window] !== undefined && windows[window] !== null) {
    windows[window].destroy();
  }
  windows[window] = new BrowserWindow({
    x: 200,
    y: 200,
    height: 92,
    width: 255,
    skipTaskbar: true,
    alwaysOnTop: true,
    show: false,
    frame: false,
    webPreferences: { webSecurity: false, nodeIntegration: true },
    resizable: false
  });

  windows[window].loadURL(
    isDev
      ? `file://${path.join(__dirname, `../public/overlays/${window}.html`)}`
      : `file://${path.join(__dirname, `../build/overlays/${window}.html`)}`
  );

  windows[window].setAlwaysOnTop(true, 'screen-saver');

  windows[window].once('ready-to-show', () => {
    windows[window].show();
    windows[window].webContents.send('overlayUpdate', data);
  });

  windows[window].on('closed', e => {
    windows[window] = null;
  });
});

ipcMain.on('overlayUpdate', (event, args) => {
  if (windows[window.event] && !windows[window.event].isDestroyed()) {
    windows[window.event].webContents.send('overlayUpdate', args);
  }
});

/*   LOG MONITOR   */

ipcMain.on('log-create', (event, data) => {
  if (windows['log-monitor'] !== undefined && windows['log-monitor'] !== null) {
    windows['log-monitor'].destroy();
  }
  windows['log-monitor'] = new BrowserWindow({
    skipTaskbar: true,
    show: false,
    webPreferences: { webSecurity: false, nodeIntegration: true }
  });
  windows['log-monitor'].loadURL(
    isDev
      ? `file://${path.join(
          __dirname,
          `../public/background-tasks/log-monitor.html`
        )}`
      : `file://${path.join(
          __dirname,
          `../build/background-tasks/log-monitor.html`
        )}`
  );

  windows['log-monitor'].on('closed', e => {
    windows['log-monitor'] = null;
  });

  windows['log-monitor'].webContents.openDevTools();
});

ipcMain.on('log-start', (event, args) => {
  if (windows['log-monitor'] && !windows['log-monitor'].isDestroyed()) {
    windows['log-monitor'].webContents.send('log-start', args);
  }
});
ipcMain.on('log-stop', (event, args) => {
  windows['log-monitor'].destroy();
  windows['main'].webContents.send('log-event', { event: 'stop' });
});
ipcMain.on('log-path', (event, args) => {
  if (windows['log-monitor'] && !windows['log-monitor'].isDestroyed()) {
    windows['log-monitor'].webContents.send('log-path', args);
  }
});
ipcMain.on('log-event', (event, args) => {
  windows['main'].webContents.send('log-event', args);
});

/*   UPDATE LOGIC   */

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', info => {
  sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', info => {
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', err => {
  sendStatusToWindow('Error in auto-updater. ' + err);
});
autoUpdater.on('download-progress', progressObj => {
  let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message =
    log_message +
    ' (' +
    progressObj.transferred +
    '/' +
    progressObj.total +
    ')';
  sendStatusToWindow(log_message);
});

autoUpdater.on('update-downloaded', (event, releaseName, releaseNotes) => {
  sendStatusToWindow('Update downloaded');
  windows['main'].webContents.send('updateDownloaded');
  shouldNotify = false;
});

function createWindow() {
  const size = electron.screen.getPrimaryDisplay().workAreaSize;

  let mainWindowState = windowStateKeeper({
    defaultWidth: size.width,
    defaultHeight: size.height
  });

  windows['main'] = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: { webSecurity: false, nodeIntegration: true },
    frame: false
  });

  mainWindowState.manage(windows['main']);

  windows['main'].loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  windows['main'].on('closed', () => {
    windows['main'] = null;
    if (windows['netWorth'] !== undefined && windows['netWorth'] !== null) {
      windows['netWorth'].destroy();
    }
  });
}

app.on('ready', async () => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (windows['main'] === null) {
    createWindow();
  }
});
