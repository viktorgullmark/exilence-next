const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = isDev;
  const extensions = ['MOBX_DEVTOOLS', 'REACT_DEVELOPER_TOOLS']; 

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

let mainWindow;

require('update-electron-app')({
  repo: 'kitze/react-electron-example',
  updateInterval: '1 hour'
});

function createWindow() {
  const size = electron.screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
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
