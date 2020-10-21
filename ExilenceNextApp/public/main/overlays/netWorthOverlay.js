const isDev = require('electron-is-dev');
const path = require('path');
const { ipcMain, BrowserWindow } = require('electron');

let netWorthOverlayWindow = null;

function createOverlay() {
  if (netWorthOverlayWindow !== undefined && netWorthOverlayWindow !== null) {
    netWorthOverlayWindow.destroy();
  }

  netWorthOverlayWindow = new BrowserWindow({
    x: 200,
    y: 200,
    height: 92,
    width: 255,
    skipTaskbar: true,
    alwaysOnTop: true,
    show: false,
    frame: false,
    webPreferences: { webSecurity: false, nodeIntegration: true },
    resizable: false,
  });

  netWorthOverlayWindow.loadURL(
    isDev
      ? `file://${path.join(__dirname, `../../../public/main/overlays/netWorth.html`)}`
      : `file://${path.join(__dirname, `../../../build/main/overlays/netWorth.html`)}`
  );

  netWorthOverlayWindow.setAlwaysOnTop(true, 'screen-saver');

  netWorthOverlayWindow.on('closed', (e) => {
    netWorthOverlayWindow = null;
  });
}

function destroyNetWorthOverlayWindow() {
  if (netWorthOverlayWindow !== undefined && netWorthOverlayWindow !== null) {
    netWorthOverlayWindow.destroy();
  }

  netWorthOverlayWindow.destroy();
}

function createNetWorthOverlay() {
  ipcMain.on('createOverlay', (_event, data) => {
    createOverlay();

    netWorthOverlayWindow.once('ready-to-show', () => {
      netWorthOverlayWindow.show();
      netWorthOverlayWindow.webContents.send('overlayUpdate', data);
    });
  });

  ipcMain.on('overlayUpdate', (_event, args) => {
    if (netWorthOverlayWindow && !netWorthOverlayWindow.isDestroyed()) {
      netWorthOverlayWindow.webContents.send('overlayUpdate', args);
    }
  });
};

module.exports = {
  createOverlay,
  destroyNetWorthOverlayWindow,
  createNetWorthOverlay,
};
