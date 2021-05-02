const { ipcMain, BrowserWindow } = require('electron');

const checkForMissingWindow = require('../util');

const createAuthWindow = ({ mainWindow }) => {
  checkForMissingWindow({ category: 'authWindow', mainWindow });

  ipcMain.on('create-auth-window', (_event, options) => {
    let authWindow = new BrowserWindow({
      width: 500,
      height: 750,
      show: false,
      autoHideMenuBar: true,
      nodeIntegration: true,
      contextIsolation: false,
      fullscreenable: false,
      resizable: false,
      minimizable: false,
      maximizable: false,
      alwaysOnTop: true,
    });

    const authUrl = `https://www.pathofexile.com/oauth/authorize?client_id=${options.clientId}&response_type=${options.responseType}&scope=${options.scopes}&state=${options.state}&redirect_uri=${options.redirectUrl}`;

    authWindow.webContents.on('will-redirect', (_event, url) => {
      console.log("redirected url", url)
      // todo: handle returned state
      const raw_code = /code=([^&]*)/.exec(url) || null;
      const code = raw_code && raw_code.length > 1 ? raw_code[1] : null;
      const error = /\?error=(.+)$/.exec(url);

      if (code || error) {
        authWindow.destroy();
      }
      mainWindow.webContents.send('auth-callback', { code, error });
    });

    // Reset the authWindow on close
    authWindow.on(
      'close',
      function () {
        authWindow = null;
      },
      false
    );

    authWindow.loadURL(authUrl, { extraHeaders: 'Authorization TEST' });
    authWindow.show();
  });
};

module.exports = {
  createAuthWindow,
};
