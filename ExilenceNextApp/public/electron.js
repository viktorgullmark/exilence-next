const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const sentry = require('@sentry/electron');

if (!isDev) {
  sentry.init({
    dsn: 'https://e69c936836334a2c9e4b553f20d1d51c@sentry.io/1843156'
  });
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = isDev;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

let mainWindow;

require('update-electron-app')({
  repo: 'viktorgullmark/exilence-next',
  updateInterval: '1 hour'
});

function createWindow() {
  const size = electron.screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    minWidth: 900,
    minHeight: 800,
    webPreferences: { webSecurity: false, nodeIntegration: true },
    frame: false
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  if (isDev) {
    await installExtensions();
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
