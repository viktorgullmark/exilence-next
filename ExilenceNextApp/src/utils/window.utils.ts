import { MouseEvent } from 'react';

import { electronService } from '../services/electron.service';

export function maximize() {
  electronService.ipcRenderer.invoke('maximize');
}

export function unmaximize() {
  electronService.ipcRenderer.invoke('unmaximize');
}

export function minimize() {
  electronService.ipcRenderer.invoke('minimize');
}

export function close() {
  electronService.ipcRenderer.invoke('close');
}

export function restart() {
  electronService.ipcRenderer.invoke('restart');
}

export function openLink(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  const link = event.currentTarget.href;
  electronService.shell.openExternal(link);
}

export function openCustomLink(link: string) {
  electronService.shell.openExternal(link);
}
