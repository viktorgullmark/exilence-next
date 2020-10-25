const { ipcMain, app } = require('electron');

const checkForMissingWindow = require('../util');

const exportMisc = ({ mainWindow }) => {
  checkForMissingWindow({category: 'exportMisc', mainWindow});

  const APP_PATH = 'app_path';
  const SESSION = 'session';

  ipcMain.once(APP_PATH, (e) => {
    e.returnValue = app.getAppPath();
  })
}

module.exports = {
  exportMisc,
}