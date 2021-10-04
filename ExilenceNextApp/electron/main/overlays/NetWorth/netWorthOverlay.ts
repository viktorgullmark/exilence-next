import { ipcMain, BrowserWindow } from 'electron';
import * as isDev from 'electron-is-dev';
import * as windowStateKeeper from 'electron-window-state';
import { browserWindows, browserWindowsConfig, NET_WORTH_OVERLAY } from '../../../browserWindows';

const netWorthOverlayConfig = () => {
  const overlayState = windowStateKeeper({
    defaultWidth: browserWindowsConfig[NET_WORTH_OVERLAY].width,
    defaultHeight: browserWindowsConfig[NET_WORTH_OVERLAY].height,
    file: NET_WORTH_OVERLAY,
  });

  browserWindows[NET_WORTH_OVERLAY] = new BrowserWindow({
    x: overlayState.x,
    y: overlayState.y,
    height: overlayState.height,
    width: overlayState.width,
    minWidth: browserWindowsConfig[NET_WORTH_OVERLAY].width,
    minHeight: browserWindowsConfig[NET_WORTH_OVERLAY].height,
    skipTaskbar: true,
    alwaysOnTop: true,
    show: false,
    frame: false,
    webPreferences: { webSecurity: false, nodeIntegration: true, contextIsolation: false },
  });

  overlayState.manage(browserWindows[NET_WORTH_OVERLAY]);

  browserWindows[NET_WORTH_OVERLAY].loadFile(
    isDev
      ? browserWindowsConfig[NET_WORTH_OVERLAY].devLoadPath
      : browserWindowsConfig[NET_WORTH_OVERLAY].prodLoadPath
  );
  browserWindows[NET_WORTH_OVERLAY].setAlwaysOnTop(true, 'screen-saver');

  browserWindows[NET_WORTH_OVERLAY].on('closed', () => {
    browserWindows[NET_WORTH_OVERLAY] = null;
  });
};

const createNetWorthOverlay = () => {
  ipcMain.on('createOverlay', (_event, data) => {
    destroyNetWorthOverlay();
    netWorthOverlayConfig();

    if (browserWindows[NET_WORTH_OVERLAY] instanceof BrowserWindow) {
      browserWindows[NET_WORTH_OVERLAY].once('ready-to-show', () => {
        if (browserWindows[NET_WORTH_OVERLAY]) {
          browserWindows[NET_WORTH_OVERLAY].show();
          browserWindows[NET_WORTH_OVERLAY].webContents.send('overlayUpdate', data);
        }
      });
    }
  });

  ipcMain.on('overlayUpdate', (_event, args) => {
    if (browserWindows[NET_WORTH_OVERLAY] instanceof BrowserWindow) {
      browserWindows[NET_WORTH_OVERLAY].webContents.send('overlayUpdate', args);
    }
  });
};

const destroyNetWorthOverlay = () =>
  browserWindows[NET_WORTH_OVERLAY] instanceof BrowserWindow &&
  browserWindows[NET_WORTH_OVERLAY].destroy();

export { createNetWorthOverlay, destroyNetWorthOverlay };
