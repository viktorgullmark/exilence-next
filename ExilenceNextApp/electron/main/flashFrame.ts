import { BrowserWindow, ipcMain } from 'electron';

import checkForMissingWindow from './utils';

type CreateFlashFrameTypes = {
  mainWindow: BrowserWindow;
};

const createFlashFrame = ({ mainWindow }: CreateFlashFrameTypes) => {
  checkForMissingWindow({ category: 'flashFrame', mainWindow });

  ipcMain.on('notify', function () {
    mainWindow.flashFrame(true);
  });
};

export { createFlashFrame };
