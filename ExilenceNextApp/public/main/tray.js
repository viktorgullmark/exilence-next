const { checkForUpdates } = require('./autoUpdater');
const { destroyNetWorthOverlayWindow } = require('./overlays/netWorthOverlay');
const path = require('path');
const { app, Tray, Menu, shell } = require('electron');

const trayIconPath = path.join(__dirname, `../icon512x512.png`);
const checkForMissingWindow = require('../util');

let tray;

const createTray = ({ mainWindow, updateAvailable, isQuittingCallback }) => {
  checkForMissingWindow({category: 'tray', mainWindow})

  tray = new Tray(trayIconPath);
  const separator = { type: 'separator' };
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Exilence Next',
      click: () => mainWindow.show(),
    },
    {
      label: 'Check for Updates...',
      sublabel: updateAvailable ? 'Update available!' : 'No updates available',
      click: async () => {
        await checkForUpdates();
      },
    },
    separator,
    {
      label: 'Patreon',
      type: 'normal',
      click: async () => {
        await shell.openExternal('https://www.patreon.com/exilence');
      },
    },
    {
      label: 'Discord / Help',
      type: 'normal',
      click: async () => {
        await shell.openExternal('https://discord.gg/yxuBrPY');
      },
    },
    separator,
    {
      label: 'Quit',
      type: 'normal',
      click: () => {
        isQuittingCallback(true);
        destroyNetWorthOverlayWindow();
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Exilence Next');
  tray.on('click', () => mainWindow.show());
  tray.setIgnoreDoubleClickEvents(true);
  tray.setContextMenu(contextMenu);

  return tray
};

module.exports = {
  createTray,
};
