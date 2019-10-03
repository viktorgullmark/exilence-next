import { IpcRenderer, WebFrame, Remote } from 'electron';
import { ChildProcess } from 'child_process';

const ipcRenderer: IpcRenderer = window.require('electron').ipcRenderer;
const webFrame: WebFrame = window.require('electron').webFrame;
const remote: Remote = window.require('electron').remote;
const childProcess: ChildProcess = window.require('child_process');
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

