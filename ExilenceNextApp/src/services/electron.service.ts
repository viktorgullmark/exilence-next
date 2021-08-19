const { webFrame, ipcRenderer, shell, BrowserWindow, clipboard } = window.require('electron');
const childProcess = window.require('child_process');
const fs = window.require('fs');

const { localSettings, appPath, appLocale } = ipcRenderer.sendSync('app-globals', '');

export const electronService = {
  BrowserWindow,
  ipcRenderer,
  webFrame,
  childProcess,
  fs,
  shell,
  appPath,
  appLocale,
  localSettings,
  clipboard,
};
