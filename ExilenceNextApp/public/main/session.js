const { ipcMain, session } = require('electron');

const createSession = () => {
  const SET_COOKIE = 'set-cookie';
  const GET_COOKIE = 'get-cookie';
  const REMOVE_COOKIE = 'remove-cookie';

  ipcMain.handle(SET_COOKIE, (_event, arg) => {
    return session.defaultSession.cookies.set(arg);
  });

  ipcMain.handle(GET_COOKIE, (_event, arg) => {
    return session.defaultSession.cookies.get(arg);
  });

  ipcMain.handle(REMOVE_COOKIE, (_event, url, id) => {
    return session.defaultSession.cookies.remove(url, id);
  });
}

module.exports = {
  createSession,
}