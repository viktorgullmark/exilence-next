const { ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

const checkForMissingWindow = require('../util');
const { getLocalSettings } = require('../main/localSettings');
let shouldNotify = true;

function checkForUpdates() {
  if (shouldNotify) {
    autoUpdater.checkForUpdatesAndNotify();
  } else {
    autoUpdater.checkForUpdates();
  }
}

const createAutoUpdater = ({ mainWindow, callbackUpdateAvailable }) => {
  checkForMissingWindow({category: 'autoUpdater', mainWindow})

  autoUpdater.channel = getLocalSettings().releaseChannel;
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  log.info('App starting...');

  function sendStatusToWindow(text) {
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

module.exports = {
  createAutoUpdater,
  checkForUpdates,
};
