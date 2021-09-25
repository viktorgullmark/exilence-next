import { BrowserWindow, ipcMain } from 'electron';
import * as isDev from 'electron-is-dev';
import { browserWindows, browserWindowsConfig, LOG_MONITOR_OVERLAY } from '../../../browserWindows';

import checkForMissingWindow from '../../utils';
import {LOGS} from "../../../enums";

type CreateLogMonitorProps = {
  mainWindow: BrowserWindow;
};

const createLogMonitorOverlay = ({ mainWindow }: CreateLogMonitorProps) => {
  checkForMissingWindow({ category: LOG_MONITOR_OVERLAY, mainWindow });

  ipcMain.on(LOGS.CREATE, () => {
    destroyLogMonitorOverlay();

    browserWindows[LOG_MONITOR_OVERLAY] = new BrowserWindow({
      skipTaskbar: true,
      show: false,
      webPreferences: { webSecurity: false, nodeIntegration: true, contextIsolation: false },
    });

    browserWindows[LOG_MONITOR_OVERLAY].loadFile(
      isDev
        ? browserWindowsConfig[LOG_MONITOR_OVERLAY].devLoadPath
        : browserWindowsConfig[LOG_MONITOR_OVERLAY].prodLoadPath
    );

    browserWindows[LOG_MONITOR_OVERLAY].on('closed', () => {
      browserWindows[LOG_MONITOR_OVERLAY] = null;
    });
  });

  ipcMain.on(LOGS.START, (_event, args) => {
    if (browserWindows[LOG_MONITOR_OVERLAY] instanceof BrowserWindow) {
      browserWindows[LOG_MONITOR_OVERLAY].webContents.send(LOGS.START, args);
    }
  });

  ipcMain.on(LOGS.STOP, () => {
    destroyLogMonitorOverlay();

    mainWindow.webContents.send(LOGS.STOP, { event: 'stop' });
  });

  ipcMain.on(LOGS.PATH, (_event, args) => {
    if (browserWindows[LOG_MONITOR_OVERLAY] instanceof BrowserWindow) {
      browserWindows[LOG_MONITOR_OVERLAY].webContents.send(LOGS.PATH, args);
    }
  });

  ipcMain.on(LOGS.EVENT, (_event, args) => {
    mainWindow.webContents.send(LOGS.EVENT, args);
  });
};

const destroyLogMonitorOverlay = () =>
  browserWindows[LOG_MONITOR_OVERLAY] instanceof BrowserWindow &&
  browserWindows[LOG_MONITOR_OVERLAY].destroy();

export { createLogMonitorOverlay, destroyLogMonitorOverlay };
