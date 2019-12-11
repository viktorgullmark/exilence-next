
const ipcRenderer = window.require('electron').ipcRenderer;
const ipcMain = window.require('electron').ipcMain;
const webFrame = window.require('electron').webFrame;
const remote = window.require('electron').remote;
const shell = window.require('electron').shell;
const childProcess = window.require('child_process');
const fs = window.require('fs');

export const electronService = {
    ipcRenderer,
    ipcMain,
    webFrame,
    remote,
    childProcess,
    fs,
    shell
};

