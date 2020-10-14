import { electronService } from '../services/electron.service';
import { MouseEvent } from 'react';

export function maximize() {
  electronService.remote.getCurrentWindow().maximize();
}

export function unmaximize() {
  electronService.remote.getCurrentWindow().unmaximize();
}

export function minimize() {
  electronService.remote.getCurrentWindow().minimize();
}

export function close() {
  electronService.remote.getCurrentWindow().close();
}

export function openLink(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
  let link = event.currentTarget.href;
  electronService.shell.openExternal(link);
}

export function openCustomLink(link: string) {
  electronService.shell.openExternal(link);
}
