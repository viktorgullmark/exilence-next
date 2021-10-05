import { ipcMain, session } from 'electron';
import { COOKIES } from '../enums';

const createSession = () => {
  ipcMain.handle(COOKIES.SET, (_event, arg) => {
    return session.defaultSession.cookies.set(arg);
  });

  ipcMain.handle(COOKIES.GET, (_event, arg) => {
    return session.defaultSession.cookies.get(arg);
  });

  ipcMain.handle(COOKIES.REMOVE, (_event, url, id) => {
    return session.defaultSession.cookies.remove(url, id);
  });
};

export { createSession };
