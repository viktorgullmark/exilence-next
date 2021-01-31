const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const checkForMissingWindow = require('../util');

let logMonitorWindow = 'log-monitor';

const createLogMonitor = ({ mainWindow }) => {
  checkForMissingWindow({category: 'logMonitor', mainWindow});

  const LOG_CREATE = 'log-create';
  const LOG_START = 'log-start';
  const LOG_STOP = 'log-stop';
  const LOG_EVENT = 'log-event';
  const LOG_PATH = 'log-path';

  ipcMain.on(LOG_CREATE, () => {
    if (logMonitorWindow !== undefined && logMonitorWindow !== null) {
      logMonitorWindow.destroy();
    }
    logMonitorWindow = new BrowserWindow({
      skipTaskbar: true,
      show: false,
      webPreferences: { webSecurity: false, nodeIntegration: true },
    });
    logMonitorWindow.loadURL(
      isDev
        ? `file://${path.join(__dirname, `../../public/background-tasks/log-monitor.html`)}`
        : `file://${path.join(__dirname, `../../build/background-tasks/log-monitor.html`)}`
    );

    logMonitorWindow.on('closed', () => {
      logMonitorWindow = null;
    });
  });

  ipcMain.on(LOG_START, (_event, args) => {
    if (logMonitorWindow && !logMonitorWindow.isDestroyed()) {
      logMonitorWindow.webContents.send(LOG_START, args);
    }
  });

  ipcMain.on(LOG_STOP, () => {
    logMonitorWindow.destroy();
    mainWindow.webContents.send(LOG_EVENT, { event: 'stop' });
  });

  ipcMain.on(LOG_PATH, (_event, args) => {
    if (logMonitorWindow && !logMonitorWindow.isDestroyed()) {
      logMonitorWindow.webContents.send(LOG_PATH, args);
    }
  });

  ipcMain.on(LOG_EVENT, (_event, args) => {
    mainWindow.webContents.send(LOG_EVENT, args);
  });
};

module.exports = {
  createLogMonitor,
};
