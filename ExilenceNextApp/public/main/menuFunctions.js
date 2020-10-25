const { ipcMain } = require('electron');

const checkForMissingWindow = require('../util');

const menuFunctions = ({ mainWindow }) => {
  checkForMissingWindow({category: 'menuFunctions', mainWindow});

  const MAXIMIZE = 'maximize';
  const UNMAXIMIZE = 'unmaximize';
  const MINIMIZE = 'minimize';
  const CLOSE = 'close';

  ipcMain.handle(MAXIMIZE, () => mainWindow.maximize())

  ipcMain.handle(UNMAXIMIZE, () => mainWindow.unmaximize())

  ipcMain.handle(MINIMIZE, () => mainWindow.minimize())

  ipcMain.handle(CLOSE, () => mainWindow.close())
}

module.exports = {
  menuFunctions,
}