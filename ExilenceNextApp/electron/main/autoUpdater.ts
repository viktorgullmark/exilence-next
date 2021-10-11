import { ipcMain, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import checkForMissingWindow from './utils';
import { getLocalSettings } from './localSettings';
let shouldNotify = true;

const checkForUpdates = () => {
  if (shouldNotify) {
    autoUpdater.checkForUpdatesAndNotify();
  } else {
    autoUpdater.checkForUpdates();
  }
};

type CreateAutoUpdaterType = {
  mainWindow: BrowserWindow;
  callbackUpdateAvailable: (status: boolean) => void;
};

const createAutoUpdater = ({ mainWindow, callbackUpdateAvailable }: CreateAutoUpdaterType) => {
  checkForMissingWindow({ category: 'autoUpdater', mainWindow });

  autoUpdater.channel = getLocalSettings().releaseChannel;
  autoUpdater.allowDowngrade = false;
  autoUpdater.logger = log;
  log.info('App starting...');

  function sendStatusToWindow(text: string) {
    log.info(text);
    mainWindow.webContents.send('message', text);
  }

  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
  });

  autoUpdater.on('update-available', () => {
    sendStatusToWindow('Update available.');
    callbackUpdateAvailable(true);
  });

  autoUpdater.on('update-not-available', () => {
    sendStatusToWindow('Update not available.');
  });

  autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
    sendStatusToWindow(log_message);
  });

  autoUpdater.on('update-downloaded', () => {
    sendStatusToWindow('Update downloaded');
    mainWindow.webContents.send('updateDownloaded');
    shouldNotify = false;
  });

  ipcMain.on('checkForUpdates', checkForUpdates);

  ipcMain.on('quitAndInstall', function () {
    autoUpdater.quitAndInstall();
  });
};

export { createAutoUpdater, checkForUpdates };
