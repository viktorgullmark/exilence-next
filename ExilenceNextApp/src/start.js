
const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = true;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

let mainWindow;

function createWindow() {
  const size = electron.screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: size.width,
    height: size.height,
    webPreferences: { webSecurity: false, nodeIntegration: true },
    frame: false,
  });

  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      url.format({
        pathname: path.join(__dirname, '/../public/index.html'),
        protocol: 'file:',
        slashes: true
      })
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  await installExtensions();
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
