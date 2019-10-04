
const ipcRenderer = window.require('electron').ipcRenderer;
const webFrame = window.require('electron').webFrame;
const remote = window.require('electron').remote;
const childProcess = window.require('child_process');
const fs = window.require('fs');

export const electronService = {
    ipcRenderer,
    webFrame,
    remote,
    childProcess,
    fs,
    isElectron
};

function isElectron() {
    return window && window.process && window.process.type;
}

