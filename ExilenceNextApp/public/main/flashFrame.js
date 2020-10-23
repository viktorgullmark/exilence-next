const { ipcMain } = require('electron');

const checkForMissingWindow = require('../util');

const createFlashFrame = ({ event, mainWindow }) => {
  checkForMissingWindow({category: 'flashFrame', mainWindow})

  ipcMain.on(event, function () {
    mainWindow.flashFrame(true);
  });
};

module.exports = {
  createFlashFrame,
};
