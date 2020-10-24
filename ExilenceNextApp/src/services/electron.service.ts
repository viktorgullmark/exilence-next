const { webFrame, ipcRenderer, shell, BrowserWindow } = window.require('electron');
const childProcess = window.require('child_process');
const fs = window.require('fs');

const { appPath, appLocale, session } = ipcRenderer.sendSync('app-globals', '');

export const electronService = {
  BrowserWindow,
  ipcRenderer,
  webFrame,
  childProcess,
  fs,
  shell,
  appPath,
  appLocale,
  session,
};
