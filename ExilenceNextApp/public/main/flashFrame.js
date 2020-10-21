const { ipcMain } = require('electron');

const createFlashFrame = ({ event, mainWindow }) => {
  ipcMain.on(event, function () {
    mainWindow.flashFrame(true);
  });
};

module.exports = {
  createFlashFrame,
};
