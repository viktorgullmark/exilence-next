const { webFrame, BrowserWindow, ipcRenderer, shell, remote, app, ...rest } = window.require('electron');
const childProcess = window.require('child_process');
const fs = window.require('fs');

console.log({ remote, app, rest});

export const electronService = {
  BrowserWindow,
  ipcRenderer,
  webFrame,
  childProcess,
  fs,
  shell,
  remote,
};
