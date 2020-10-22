const { checkForUpdates } = require('./autoUpdater');
const { createOverlay, destroyNetWorthOverlayWindow } = require('./overlays/netWorthOverlay');

const path = require('path');

const { app, Tray, Menu, shell } = require('electron');
const trayIconPath = path.join(__dirname, `../tray.jpg`);

let tray;

const createTray = ({ mainWindow, updateAvailable, isQuittingCallback }) => {
  tray = new Tray(trayIconPath);
  const separator = { type: 'separator' };
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Exilence Next',
      click: () => mainWindow.show(),
    },
    separator,
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
};

module.exports = {
  createTray,
};
