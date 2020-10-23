const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

const checkForMissingWindow = require('../util');

let logMonitorWindow = 'log-monitor';

const createLogMonitor = ({ mainWindow }) => {
  checkForMissingWindow({category: 'logMonitor', mainWindow});

  const logCreate = 'log-create';
  const logStart = 'log-start';
  const logStop = 'log-stop';
  const logEvent = 'log-event';
  const logPath = 'log-path';

  ipcMain.on(logCreate, () => {
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

  ipcMain.on(logStart, (_event, args) => {
    if (logMonitorWindow && !logMonitorWindow.isDestroyed()) {
      logMonitorWindow.webContents.send(logStart, args);
    }
  });

  ipcMain.on(logStop, () => {
    logMonitorWindow.destroy();
    mainWindow.webContents.send(logEvent, { event: 'stop' });
  });

  ipcMain.on(logPath, (_event, args) => {
    if (logMonitorWindow && !logMonitorWindow.isDestroyed()) {
      logMonitorWindow.webContents.send(logPath, args);
    }
  });

  ipcMain.on(logEvent, (_event, args) => {
    mainWindow.webContents.send(logEvent, args);
  });
};

module.exports = {
  createLogMonitor,
};
