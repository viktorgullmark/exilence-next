import { BrowserWindow, ipcMain } from 'electron';

import checkForMissingWindow from './utils';
import { MENU_FUNCTIONS } from '../enums';

type MenuFunctionsProps = {
  mainWindow: BrowserWindow;
};

const menuFunctions = ({ mainWindow }: MenuFunctionsProps) => {
  checkForMissingWindow({ category: 'menuFunctions', mainWindow });

  ipcMain.handle(MENU_FUNCTIONS.MAXIMIZE, () => mainWindow.maximize());

  ipcMain.handle(MENU_FUNCTIONS.UNMAXIMIZE, () => mainWindow.unmaximize());

  ipcMain.handle(MENU_FUNCTIONS.MINIMIZE, () => mainWindow.minimize());

  ipcMain.handle(MENU_FUNCTIONS.CLOSE, () => mainWindow.close());
};

export { menuFunctions };
